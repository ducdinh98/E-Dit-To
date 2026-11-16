/**
 * CM (Creative-Mode) Deterministic GSAP Helpers for HyperFrames
 * All helpers initialize state at t=0 via tl.set() and animate at `at`
 * to prevent gsap_css_transform_conflict and guarantee seek-safety.
 */
window.CM = {
  /**
   * Create and register a seek-safe paused GSAP timeline for a HyperFrames composition.
   */
  createTimeline(compId) {
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
    window.__timelines[compId] = tl;
    return tl;
  },

  /**
   * Pop in one or more elements with Neo-Brutalist snappy overshoot.
   */
  popIn(tl, target, at, opts = {}) {
    const {
      y = 24,
      x = 0,
      scale = 0.92,
      duration = 0.42,
      stagger = 0.08,
      ease = "back.out(1.6)"
    } = opts;
    tl.set(target, { autoAlpha: 0, x, y, scale }, 0);
    tl.to(target, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration, stagger, ease }, at);
    return tl;
  },

  /**
   * Fade/slide out elements cleanly when changing beats inside a macro-scene.
   */
  popOut(tl, target, at, opts = {}) {
    const { y = -18, scale = 0.96, duration = 0.28, stagger = 0.04 } = opts;
    tl.to(target, { autoAlpha: 0, y, scale, duration, stagger, ease: "power2.in" }, at);
    return tl;
  },

  /**
   * Draw an SVG path/line/circle using strokeDasharray & strokeDashoffset.
   */
  drawPath(tl, target, at, duration = 0.7, length = 1200, ease = "power2.inOut") {
    tl.set(target, { strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1 }, 0);
    tl.to(target, { strokeDashoffset: 0, duration, ease }, at);
    return tl;
  },

  /**
   * Fill a horizontal or vertical meter/bar without CSS transform conflicts.
   */
  fillBar(tl, target, at, toScale = 1, duration = 0.55, axis = "X", origin = "left center") {
    const initProps = { transformOrigin: origin };
    const animProps = { duration, ease: "power3.out" };
    if (axis.toUpperCase() === "Y") {
      initProps.scaleY = 0;
      animProps.scaleY = toScale;
    } else {
      initProps.scaleX = 0;
      animProps.scaleX = toScale;
    }
    tl.set(target, initProps, 0);
    tl.to(target, animProps, at);
    return tl;
  },

  /**
   * Deterministic number counter inside a DOM element.
   */
  countUp(tl, selectorOrEl, at, fromVal, toVal, duration = 0.8, formatFn = null) {
    const el = typeof selectorOrEl === "string" ? document.querySelector(selectorOrEl) : selectorOrEl;
    if (!el) return tl;
    const proxy = { val: fromVal };
    const formatter = formatFn || ((v) => Math.round(v).toString());
    tl.set(proxy, {
      val: fromVal,
      onUpdate: () => { el.textContent = formatter(proxy.val); }
    }, 0);
    tl.to(proxy, {
      val: toVal,
      duration,
      ease: "power2.out",
      onUpdate: () => { el.textContent = formatter(proxy.val); }
    }, at);
    return tl;
  }
};
