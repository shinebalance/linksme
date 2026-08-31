declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackLinkClick(params: {
  groupId: string;
  linkId: string;
  linkLabel: string;
  linkUrl: string;
  action: 'click' | 'copy';
}): void {
  window.gtag?.('event', 'link_click', {
    group_id: params.groupId,
    link_id: params.linkId,
    link_label: params.linkLabel,
    link_url: params.linkUrl,
    action: params.action
  });
}

export function trackDockAction(action: string): void {
  window.gtag?.('event', 'dock_action', {
    action
  });
}
