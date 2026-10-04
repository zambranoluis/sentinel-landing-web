"use client";

import Image from "next/image";
import { useId, type CSSProperties } from "react";
import {
  heroDetections,
  transferWave,
  type HeroDetection,
} from "./heroDetections";
import { useHeroCallout, useHeroScene } from "./useHeroScene";
import styles from "./HeroScene.module.css";

function DetectionDescription({ target }: { target: HeroDetection }) {
  return (
    <>
      <p>{target.description}</p>
      <p className={styles.caption}>Illustrative detection</p>
      <dl>
        {target.fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function RouteWave() {
  return (
    <animate
      data-route-wave
      attributeName="d"
      values={transferWave}
      dur="10s"
      repeatCount="indefinite"
      begin="indefinite"
      calcMode="spline"
      keyTimes="0;0.25;0.5;0.75;1"
      keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
    />
  );
}

export function HeroScene() {
  const {
    scene,
    artwork,
    camera,
    panel,
    origin,
    selected,
    pinned,
    ready,
    hover,
    leave,
    cancelExit,
    clear,
    activate,
    setFocused,
  } = useHeroScene();
  const id = useId();
  const target = heroDetections.find((item) => item.id === selected);
  useHeroCallout(artwork, panel, target);
  return (
    <figure
      ref={scene}
      className={styles.scene}
      data-hero-scene
      data-selected={selected ?? ""}
      data-pinned={pinned ?? ""}
      data-ready={ready}
      data-running="false"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          clear(panel.current?.contains(document.activeElement) ?? false);
        }
      }}
      onBlur={(event) => {
        if (!panel.current?.contains(event.relatedTarget)) setFocused(null);
      }}
    >
      <div
        className={styles.artwork}
        ref={artwork}
        data-hero-artwork
        onClick={(event) => {
          if (!(event.target as Element).closest("[data-detection]")) clear();
        }}
      >
        <div className={styles.viewport}>
          <div className={styles.camera} ref={camera} data-hero-camera>
            <Image
              src="/images/warehouse.png"
              alt=""
              fill
              preload
              sizes="(max-aspect-ratio: 1672/941) 178vh, 100vw"
              className={styles.image}
            />
            <svg
              className={styles.shading}
              viewBox="0 0 1672 941"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                {heroDetections.map((item) => (
                  <mask
                    key={item.id}
                    id={`${id}-mask-${item.id}`}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="1672"
                    height="941"
                  >
                    <rect width="1672" height="941" fill="white" />
                    <path
                      d={item.region}
                      fill={item.route ? "none" : "black"}
                      stroke="black"
                      strokeWidth={item.route ? 38 : 12}
                      strokeLinejoin="round"
                    />
                  </mask>
                ))}
              </defs>
              {heroDetections.map((item) => (
                <rect
                  key={item.id}
                  width="1672"
                  height="941"
                  className={styles.shade}
                  data-active={selected === item.id}
                  mask={`url(#${id}-mask-${item.id})`}
                />
              ))}
            </svg>
            <div className={styles.readability} />
            <svg
              className={styles.detections}
              viewBox="0 0 1672 941"
              preserveAspectRatio="xMidYMid slice"
              role="group"
              aria-label="Illustrative warehouse detections"
            >
              <defs>
                <linearGradient id={`${id}-accent`}>
                  <stop stopColor="#72bde9" />
                  <stop offset="1" stopColor="#effaff" />
                </linearGradient>
              </defs>
              {heroDetections.map((item, index) => (
                <g
                  key={item.id}
                  className={styles.target}
                  data-detection={item.id}
                  data-active={selected === item.id}
                  role={ready ? "button" : undefined}
                  tabIndex={ready ? 0 : undefined}
                  aria-label={item.title}
                  aria-pressed={ready ? pinned === item.id : undefined}
                  aria-describedby={`${id}-description-${item.id}`}
                  aria-controls={
                    ready && selected === item.id ? `${id}-detail` : undefined
                  }
                  style={{ "--delay": `${index * -0.63}s` } as CSSProperties}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse")
                      hover(
                        item.id,
                        event.currentTarget,
                        event.clientX,
                        event.clientY,
                      );
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType === "mouse")
                      hover(
                        item.id,
                        event.currentTarget,
                        event.clientX,
                        event.clientY,
                      );
                  }}
                  onPointerLeave={leave}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(":focus-visible")) {
                      origin.current = event.currentTarget;
                      setFocused(item.id);
                    }
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    activate(item.id, event.currentTarget);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      activate(item.id, event.currentTarget);
                    }
                  }}
                >
                  <path
                    className={styles.halo}
                    data-detection-layer="halo"
                    d={item.outline}
                  >
                    {item.route && <RouteWave />}
                  </path>
                  <path className={styles.understroke} d={item.outline}>
                    {item.route && <RouteWave />}
                  </path>
                  <path
                    className={`${styles.outline} ${item.route ? styles.route : ""}`}
                    data-detection-layer="outline"
                    d={item.outline}
                  >
                    {item.route && <RouteWave />}
                  </path>
                  <path
                    className={`${styles.accent} ${item.route ? styles.route : ""}`}
                    data-detection-layer="accent"
                    d={item.route ? item.outline : item.region}
                    pathLength={item.route ? undefined : 100}
                    stroke={`url(#${id}-accent)`}
                  >
                    {item.route && <RouteWave />}
                  </path>
                  {item.corners && (
                    <path
                      className={styles.corners}
                      data-detection-layer="corners"
                      d={item.corners}
                    />
                  )}
                  {item.nodes?.map(([x, y]) => (
                    <g key={`${x}-${y}`} className={styles.marker}>
                      <rect
                        className={styles.node}
                        x={x - 3}
                        y={y - 3}
                        width="6"
                        height="6"
                        rx="0.6"
                      />
                      <circle
                        className={styles.nodeCenter}
                        cx={x}
                        cy={y}
                        r="1"
                      />
                    </g>
                  ))}
                  {item.route && (
                    <g className={styles.marker}>
                      <circle
                        className={styles.endpoint}
                        cx="590"
                        cy="454"
                        r="4"
                      />
                      <circle
                        className={styles.endpoint}
                        cx="1497"
                        cy="919"
                        r="4"
                      />
                    </g>
                  )}
                  <path
                    data-detection-layer="hit"
                    className={item.route ? styles.routeHit : styles.hit}
                    d={item.region}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
      {heroDetections.map((item) => (
        <div
          key={item.id}
          id={`${id}-description-${item.id}`}
          className={styles.visuallyHidden}
        >
          <DetectionDescription target={item} />
        </div>
      ))}
      {target && (
        <div
          ref={panel}
          id={`${id}-detail`}
          className={styles.detail}
          role="region"
          aria-labelledby={`${id}-title`}
          data-hero-detail
          onPointerEnter={cancelExit}
          onPointerLeave={leave}
        >
          <div className={styles.detailHeading}>
            <h2 id={`${id}-title`}>{target.title}</h2>
            <button
              type="button"
              aria-label="Close detection details"
              onClick={() => clear(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="m4 4 8 8M12 4l-8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>
          <DetectionDescription target={target} />
        </div>
      )}
    </figure>
  );
}
