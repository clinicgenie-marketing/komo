/* PRESERVED for the individual Scalp Oil Balancing Essence page (a later
 * build). Not mounted on the homepage since Section 05 became the product
 * range still (src/sections/ProductRange.tsx). Its styles stay in index.css
 * (".product…", ".bottle…", ".name-line…", ".ingredient…"), its assets in
 * public/images/product and public/images/ingredients, its copy in
 * src/content/product.ts. BottleHandover.tsx (beside this file) is the
 * card-06 → bottle close-up transition that led into it. */
/* ---------------------------------------------------------------------------
 * 06 A closer look at the bottle (storyboard frames 10–12)
 *
 * Pinned scene, one scrubbed GSAP timeline (any width, motion allowed):
 *   name        frame 10: the bottle holds the exact centre while "Scalp Oil"
 *               enters from the left, "Balancing" from the right and
 *               "Essence" from the left, each settling before the next
 *   ingredient  frame 11: the horse chestnut, then avocado, olives and
 *               Myrothamnus flabellifolia slide out from behind the bottle's
 *               edges in turn; the bottle stays in front, overlapping them
 *   label       frame 12: one continuous zoom towards the front label (the
 *               zoom target), while the name, ingredient and contour leave
 * The ingredient paragraph and links follow in normal flow after release.
 *
 * Reduced motion: heading, name, bottle, ingredients, label detail,
 * paragraph and links in reading order, with no pinning.
 * The product name is exposed to screen readers once, in full.
 * ------------------------------------------------------------------------- */
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/Arrow";
import { WaveCorner } from "@/components/WaveCorner";
import { PLACEHOLDER_LABEL, bottle, product } from "@/content/product";
import { headerHeight } from "@/lib/stage";

gsap.registerPlugin(ScrollTrigger);

const SCENE_QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 480px)";

const labelBox = bottle.kind === "image" ? bottle.label : PLACEHOLDER_LABEL;

/* --------------------------------- Bottle --------------------------------- */

/**
 * Schematic placeholder bottle from the storyboard: olive body, ivory front
 * label with the KOMO wordmark and the product name. Vector, so the label is
 * sharp at any zoom. `viewBox` lets the label detail crop to the label.
 */
function PlaceholderBottle({ viewBox = "0 0 200 520" }: { viewBox?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="bottle-svg"
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`${id}-sheen`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-wordmark`} style={{ maskType: "alpha" }}>
          <image href="/images/komo-wordmark.svg" x="56" y="214" width="88" height="21.4" />
        </mask>
      </defs>
      <rect x="72" y="0" width="56" height="52" rx="7" fill="#26352c" />
      <rect x="82" y="48" width="36" height="24" fill="#26352c" />
      <rect x="0" y="66" width="200" height="454" rx="36" fill="#34463a" />
      <rect x="0" y="66" width="200" height="454" rx="36" fill={`url(#${id}-sheen)`} />
      <rect x="18" y="190" width="164" height="190" rx="3" fill="#f4f0e7" />
      <rect x="56" y="214" width="88" height="21.4" fill="#34463a" mask={`url(#${id}-wordmark)`} />
      <line x1="40" y1="252" x2="160" y2="252" stroke="#34463a" strokeOpacity="0.25" />
      <text
        x="100"
        y="296"
        textAnchor="middle"
        fill="#34463a"
        fontFamily="Manrope, sans-serif"
        fontSize="17"
        fontWeight="400"
        letterSpacing="-0.3"
      >
        <tspan x="100">Scalp Oil</tspan>
        <tspan x="100" dy="21">
          Balancing Essence
        </tspan>
      </text>
    </svg>
  );
}

/**
 * Approved bottle cut-out: transparent padding is measured once and trimmed,
 * so the visible bottle (not the image box) is what gets centred.
 */
function ImageBottle({ src }: { src: string }) {
  const [trim, setTrim] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    ratio: number;
  } | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.decode().then(() => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(img, 0, 0);
      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
      let minX = width,
        minY = height,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
          if (data[(y * width + x) * 4 + 3] > 8) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
      setTrim({
        x: minX / width,
        y: minY / height,
        w: (maxX - minX + 1) / width,
        h: (maxY - minY + 1) / height,
        ratio: (maxX - minX + 1) / (maxY - minY + 1),
      });
    });
  }, [src]);
  const t = trim ?? { x: 0, y: 0, w: 1, h: 1, ratio: undefined };
  return (
    <div className="bottle-image" style={{ aspectRatio: t.ratio }}>
      <img
        src={src}
        alt=""
        style={{
          width: `${100 / t.w}%`,
          left: `${(-t.x / t.w) * 100}%`,
          top: `${(-t.y / t.h) * 100}%`,
        }}
      />
    </div>
  );
}

function Bottle() {
  return bottle.kind === "image" ? <ImageBottle src={bottle.src} /> : <PlaceholderBottle />;
}

/** Static crop of the front label (reduced-motion reading order). */
function LabelDetail() {
  const { x, y, width, height } = PLACEHOLDER_LABEL;
  const box = bottle.kind === "image" ? bottle.label : PLACEHOLDER_LABEL;
  const ratio = bottle.kind === "image" ? bottle.ratio : 200 / 520;
  return (
    <div
      className="label-detail"
      aria-hidden="true"
      style={{ aspectRatio: (box.width * ratio) / box.height }}
    >
      {bottle.kind === "placeholder" ? (
        <PlaceholderBottle viewBox={`${x * 200} ${y * 520} ${width * 200} ${height * 520}`} />
      ) : (
        <img
          src={bottle.src}
          alt=""
          style={{
            width: `${100 / bottle.label.width}%`,
            left: `${(-bottle.label.x / bottle.label.width) * 100}%`,
            top: `${(-bottle.label.y / bottle.label.height) * 100}%`,
          }}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Parts --------------------------------- */

function ProductName() {
  return (
    <p className="product-name">
      <span className="visually-hidden">{product.fullName}</span>
      {product.nameLines.map((line, index) => (
        <span key={line} className={`name-line name-line-${index + 1}`} aria-hidden="true">
          {line}
        </span>
      ))}
    </p>
  );
}

function Ingredients() {
  return product.ingredients.map((ingredient) => (
    <div
      key={ingredient.key}
      className={`ingredient ingredient-${ingredient.key}`}
      aria-hidden="true"
      style={{ "--top": ingredient.top, "--size": ingredient.size } as CSSProperties}
    >
      <img src={ingredient.image.src} alt="" />
    </div>
  ));
}

function ProductInfo() {
  return (
    <div className="product-info">
      <p>{product.body}</p>
      <ul className="visit-links">
        {product.links.map((link) => (
          <li key={link.label}>
            <a className="session-detail-link" href={link.href}>
              {link.label} <Arrow />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------- Scene ---------------------------------- */

function ProductScene() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const [scalp, balancing, essence] = gsap.utils.toArray<HTMLElement>(".name-line", stage);
      const bottleEl = stage.querySelector<HTMLElement>(".bottle");
      const contour = stage.querySelector<HTMLElement>(".product-contour");
      const items = product.ingredients.map((ingredient) => ({
        ...ingredient,
        el: stage.querySelector<HTMLElement>(`.ingredient-${ingredient.key}`)!,
      }));
      if (!bottleEl || items.some((item) => !item.el)) return;

      const W = () => stage.clientWidth;
      const H = () => stage.clientHeight;
      const enter = (direction: -1 | 1) => () => direction * (W() * 0.6);
      // Narrow screens stack the words above and below the bottle, so they
      // need not step aside for the ingredients.
      const wordsBeside = () => !window.matchMedia("(max-width: 700px)").matches;
      const body =
        bottle.kind === "image"
          ? { left: bottle.bodyX.x, right: bottle.bodyX.x + bottle.bodyX.width }
          : { left: 0, right: 1 };

      // Frame 11: out from behind the body's left or right edge, keeping part
      // of each ingredient behind it. They rest centred on the body
      // (offsetLeft, as they are centred with translate), so measure from there.
      const emerge = (item: (typeof items)[number]) => () => {
        const bw = bottleEl.offsetWidth;
        const edge = (item.side === 1 ? body.right : body.left) * bw;
        const reach = item.el.offsetWidth * (0.5 - item.overlap);
        return edge + item.side * reach - item.el.offsetLeft;
      };
      // How far the revealed ingredients reach past the bottle on one side,
      // so the words on that side can step aside by as much.
      const reach = (side: -1 | 1) => () => {
        if (!wordsBeside()) return 0;
        const bw = bottleEl.offsetWidth;
        const inset = side === 1 ? (1 - body.right) * bw : body.left * bw;
        const widest = Math.max(
          0,
          ...items
            .filter((item) => item.side === side)
            .map((item) => item.el.offsetWidth * (1 - item.overlap) - inset),
        );
        return side * widest;
      };

      // Frame 12: zoom so the front label fills the reading area, keeping the
      // label (not the bottle's centre) as the target.
      const zoom = () => {
        const bw = bottleEl.offsetWidth;
        const bh = bottleEl.offsetHeight;
        const lw = labelBox.width * bw;
        const lh = labelBox.height * bh;
        const scale = Math.min((W() * 0.86) / lw, (H() * 0.78) / lh);
        const offsetX = (labelBox.x + labelBox.width / 2 - 0.5) * bw;
        const offsetY = (labelBox.y + labelBox.height / 2 - 0.5) * bh;
        return { scale, x: -offsetX * scale, y: -offsetY * scale };
      };

      gsap.set([scalp, essence], { x: enter(-1), autoAlpha: 0 });
      gsap.set(balancing, { x: enter(1), autoAlpha: 0 });
      // Centred with xPercent/yPercent rather than the CSS translate, which GSAP
      // does not reliably keep once it also rotates the element.
      gsap.set(
        items.map((item) => item.el),
        { translate: "none", xPercent: -50, yPercent: -50, x: 0, rotation: 0, autoAlpha: 0 },
      );

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.addLabel("start")
        .to({}, { duration: 0.4 })
        .to(scalp, { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" })
        .to({}, { duration: 0.4 })
        .to(balancing, { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" })
        .to({}, { duration: 0.4 })
        .to(essence, { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" })
        .addLabel("name")
        .to({}, { duration: 0.9 })
        .addLabel("reveal");
      // One after another, overlapping, the horse chestnut first.
      items.forEach((item, index) => {
        tl.to(
          item.el,
          {
            x: emerge(item),
            rotation: item.rotate,
            autoAlpha: 1,
            duration: 1.2,
            ease: "power2.inOut",
          },
          `reveal+=${index * 0.4}`,
        );
      });
      const revealSpan = 1.2 + (items.length - 1) * 0.4;
      // The words step aside by the ingredients' reach so all stay clear.
      tl.to(balancing, { x: reach(1), duration: revealSpan, ease: "power2.inOut" }, "reveal")
        .to(
          [scalp, essence],
          { x: reach(-1), duration: revealSpan, ease: "power2.inOut" },
          "reveal",
        )
        .addLabel("ingredient")
        .to({}, { duration: 0.9 })
        // One continuous movement into the label; everything else leaves.
        .to(
          bottleEl,
          {
            scale: () => zoom().scale,
            x: () => zoom().x,
            y: () => zoom().y,
            duration: 1.8,
            ease: "power2.inOut",
            force3D: false,
          },
          "zoom",
        )
        .to(
          [scalp, essence],
          { x: () => reach(-1)() - W() * 0.4, autoAlpha: 0, duration: 0.7, ease: "power1.in" },
          "zoom",
        )
        .to(
          balancing,
          { x: () => reach(1)() + W() * 0.4, autoAlpha: 0, duration: 0.7, ease: "power1.in" },
          "zoom",
        );
      items.forEach((item) => {
        tl.to(
          item.el,
          {
            x: () => emerge(item)() + item.side * W() * 0.3,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power1.in",
          },
          "zoom",
        );
      });
      tl.to(contour, { autoAlpha: 0, duration: 0.6 }, "zoom")
        .addLabel("label")
        // Room to pause on the readable label before normal scroll resumes.
        .to({}, { duration: 1.2 });

      ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        pin: true,
        start: () => `top top+=${headerHeight()}`,
        end: () => `+=${window.innerHeight * 0.6 * tl.duration()}`,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <div className="product-stage" ref={stageRef}>
      <div className="product-contour" aria-hidden="true">
        <WaveCorner />
      </div>
      <ProductName />
      <div className="product-centre">
        <Ingredients />
        <div className="bottle">
          <Bottle />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Section -------------------------------- */

export function SingleBottleProduct() {
  const [scene, setScene] = useState(() => window.matchMedia(SCENE_QUERY).matches);
  const id = useId();

  useEffect(() => {
    const query = window.matchMedia(SCENE_QUERY);
    const onChange = () => setScene(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      id="product"
      className={`product tone-light ${scene ? "is-scene" : "is-flow"}`}
      aria-labelledby={`${id}-heading`}
      style={
        bottle.kind === "image"
          ? ({
              "--bottle-ratio": bottle.ratio,
              "--body-x": bottle.bodyX.x,
              "--body-w": bottle.bodyX.width,
            } as CSSProperties)
          : undefined
      }
    >
      <h2 id={`${id}-heading`} className="product-heading">
        {product.heading}
      </h2>
      {scene ? (
        <ProductScene />
      ) : (
        <div className="product-flow">
          <ProductName />
          <div className="product-flow-figures">
            <div className="bottle">
              <Bottle />
            </div>
            <Ingredients />
            <LabelDetail />
          </div>
        </div>
      )}
      <ProductInfo />
    </section>
  );
}
