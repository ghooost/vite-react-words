import { afterEach, vi, describe, expect, it } from "vitest";
import { Menu } from "./Menu";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

describe("Menu", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Menu /", () => {
    const out = renderToString(
      <StaticRouter location="/">
        <Menu />
      </StaticRouter>
    );
    expect(out).toMatchSnapshot();
  });

  it("Menu /setup", () => {
    const out = renderToString(
      <StaticRouter location="/setup">
        <Menu />
      </StaticRouter>
    );
    expect(out).toMatchSnapshot();
  });

  it("Menu /setup/something", () => {
    const out = renderToString(
      <StaticRouter location="/setup/something">
        <Menu />
      </StaticRouter>
    );
    expect(out).toMatchSnapshot();
  });

  it("Menu /about", () => {
    const out = renderToString(
      <StaticRouter location="/about">
        <Menu />
      </StaticRouter>
    );
    expect(out).toMatchSnapshot();
  });
});
