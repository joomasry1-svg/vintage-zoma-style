"use node";

import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

type MuxUpload = {
  id: string;
  url: string;
  status: string;
  asset_id?: string;
  errors?: { messages?: string[] };
};

type MuxAsset = {
  id: string;
  status: string;
  aspect_ratio?: string;
  duration?: number;
  progress?: { progress?: number };
  playback_ids?: { id: string; policy: string }[];
  errors?: { messages?: string[] };
};

type VideoStatus = {
  status: string;
  playbackId?: string;
  assetId?: string;
  aspectRatio?: string;
  duration?: number;
  progress?: number;
  message?: string;
};

function muxCredentials() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error(
      "فيديو المنتج غير مفعّل بعد. أضف MUX_TOKEN_ID وMUX_TOKEN_SECRET إلى مفاتيح المشروع.",
    );
  }
  return { tokenId, tokenSecret };
}

async function muxRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { tokenId, tokenSecret } = muxCredentials();
  const response = await fetch(`https://api.mux.com${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let detail = "";
    try {
      const payload = (await response.json()) as {
        error?: { messages?: string[]; message?: string };
      };
      detail =
        payload.error?.messages?.join(" ") ||
        payload.error?.message ||
        "";
    } catch {
      // The Mux error body is optional.
    }
    throw new Error(
      detail
        ? `Mux: ${detail}`
        : `تعذّر الاتصال بخدمة Mux (${response.status}).`,
    );
  }

  const payload = (await response.json()) as { data: T };
  return payload.data;
}

export const createProductVideoUpload = action({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args): Promise<{ id: string; url: string }> => {
    const valid = await ctx.runQuery(api.admin.verifyAdminToken, {
      token: args.token,
    });
    if (!valid) throw new Error("انتهت جلسة الإدارة. سجّل الدخول مرة أخرى.");

    const upload = await muxRequest<MuxUpload>("/video/v1/uploads", {
      method: "POST",
      body: JSON.stringify({
        cors_origin: "*",
        new_asset_settings: {
          playback_policies: ["public"],
          video_quality: "basic",
          passthrough: "zoma-product-video",
        },
      }),
    });

    return { id: upload.id, url: upload.url };
  },
});

export const getProductVideoUploadStatus = action({
  args: {
    token: v.string(),
    uploadId: v.string(),
  },
  handler: async (ctx, args): Promise<VideoStatus> => {
    const valid = await ctx.runQuery(api.admin.verifyAdminToken, {
      token: args.token,
    });
    if (!valid) throw new Error("انتهت جلسة الإدارة. سجّل الدخول مرة أخرى.");

    const uploadId = args.uploadId.trim();
    if (!/^[A-Za-z0-9]+$/.test(uploadId)) {
      throw new Error("معرّف الفيديو غير صالح.");
    }

    const upload = await muxRequest<MuxUpload>(
      `/video/v1/uploads/${encodeURIComponent(uploadId)}`,
    );

    if (upload.status === "errored" || upload.status === "timed_out") {
      return {
        status: "errored",
        message:
          upload.errors?.messages?.join(" ") ||
          "تعذّرت معالجة الفيديو في Mux.",
      };
    }
    if (upload.status === "cancelled") {
      return { status: "cancelled", message: "أُلغي رفع الفيديو." };
    }
    if (!upload.asset_id) {
      return { status: upload.status || "waiting" };
    }

    const asset = await muxRequest<MuxAsset>(
      `/video/v1/assets/${encodeURIComponent(upload.asset_id)}`,
    );
    if (asset.status === "ready") {
      const playback = asset.playback_ids?.find(
        (entry) => entry.policy === "public",
      );
      if (playback) {
        return {
          status: "ready",
          playbackId: playback.id,
          assetId: asset.id,
          aspectRatio: asset.aspect_ratio,
          duration: asset.duration,
          progress: 100,
        };
      }
    }
    if (asset.status === "errored") {
      return {
        status: "errored",
        assetId: asset.id,
        message:
          asset.errors?.messages?.join(" ") ||
          "تعذّرت معالجة الفيديو في Mux.",
      };
    }

    return {
      status: asset.status || "preparing",
      assetId: asset.id,
      progress: asset.progress?.progress,
    };
  },
});
