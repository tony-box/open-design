import { SIDECAR_DEFAULTS } from "@open-design/sidecar-proto";
import {
  releaseChannelFromNamespace,
  releaseChannelFromVersion,
  releaseInstallIdentity,
} from "@open-design/release";

import type { ToolPackConfig } from "../config/index.js";
import { PRODUCT_NAME } from "./constants.js";

export type MacInstallIdentity = {
  appId: string;
  executableName: string;
  installerTitle: string;
  productName: string;
  publicAppBundleName: string;
  systemAppBundleName: string;
};

function sanitizeNamespace(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "-");
}

export function resolveMacInstallIdentity(config: Pick<ToolPackConfig, "namespace" | "appVersion" | "productName">): MacInstallIdentity {
  const namespaceToken = sanitizeNamespace(config.namespace);
  const channel = releaseChannelFromVersion(config.appVersion)
    ?? releaseChannelFromNamespace(config.namespace, SIDECAR_DEFAULTS.namespace);
  const channelIdentity = channel == null
    ? { appId: "io.open-design.desktop", productName: PRODUCT_NAME }
    : releaseInstallIdentity(channel);
  const productName = config.productName ?? channelIdentity.productName;
  const publicAppBundleName = `${productName}.app`;
  const systemAppBundleName = config.productName != null || channel != null
    ? publicAppBundleName
    : `${PRODUCT_NAME}.${namespaceToken}.app`;

  return {
    ...channelIdentity,
    executableName: productName,
    installerTitle: config.productName == null && channel == null ? `${PRODUCT_NAME}-${namespaceToken}` : productName,
    productName,
    publicAppBundleName,
    systemAppBundleName,
  };
}
