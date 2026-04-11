import { Children, isValidElement, useEffect, useId, useRef, type ReactElement, type ReactNode } from "react";

type HelmetProps = {
  children?: ReactNode;
};

const MANAGED_ATTR = "data-local-helmet";
const OWNER_ATTR = "data-local-helmet-owner";

function toDomAttrName(prop: string): string {
  if (prop === "className") return "class";
  if (prop === "httpEquiv") return "http-equiv";
  return prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function collectElements(children: ReactNode, out: ReactElement[] = []): ReactElement[] {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === "title" || child.type === "meta" || child.type === "link" || child.type === "script") {
      out.push(child as ReactElement);
      return;
    }
    const nested = (child.props as { children?: ReactNode })?.children;
    if (nested) {
      collectElements(nested, out);
    }
  });
  return out;
}

function removeOwnedNodes(ownerId: string) {
  if (typeof document === "undefined") return;
  document
    .querySelectorAll(`[${MANAGED_ATTR}="true"][${OWNER_ATTR}="${ownerId}"]`)
    .forEach((node) => node.parentNode?.removeChild(node));
}

export function Helmet({ children }: HelmetProps) {
  const ownerId = useId();
  const lastTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    removeOwnedNodes(ownerId);
    const elements = collectElements(children);

    for (const el of elements) {
      if (typeof el.type !== "string") continue;
      const type = el.type;
      const props = (el.props ?? {}) as Record<string, unknown>;

      if (type === "title") {
        const titleText = Children.toArray(props.children).join("").trim();
        if (titleText) {
          lastTitleRef.current = titleText;
          document.title = titleText;
        }
        continue;
      }

      if (type !== "meta" && type !== "link" && type !== "script") continue;

      const domNode = document.createElement(type);
      domNode.setAttribute(MANAGED_ATTR, "true");
      domNode.setAttribute(OWNER_ATTR, ownerId);

      Object.entries(props).forEach(([key, value]) => {
        if (key === "children" || value === undefined || value === null || value === false) return;
        if (value === true) {
          domNode.setAttribute(toDomAttrName(key), "");
          return;
        }
        domNode.setAttribute(toDomAttrName(key), String(value));
      });

      if (type === "script" && props.children) {
        domNode.textContent = Children.toArray(props.children).join("");
      }

      document.head.appendChild(domNode);
    }

    return () => {
      removeOwnedNodes(ownerId);
    };
  }, [children, ownerId]);

  return null;
}


