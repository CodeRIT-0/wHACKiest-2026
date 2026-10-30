"use client";

import { useEffect, useState, type RefObject } from "react";
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export function journeyState(signalY: number, nodeY: number) {
  return { reached: signalY >= nodeY, emphasis: clamp(1 - Math.abs(signalY - nodeY) / 280), action: clamp((signalY - nodeY + 95) / 130) };
}

// A single passive document-scroll source owns every procedure circuit and pose.
export function useProcedureJourney(sectionRef: RefObject<HTMLElement | null>) {
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const route = section.querySelector<HTMLElement>(".journey-route")!;
    const svg = section.querySelector<SVGSVGElement>(".journey-circuit")!;
    const stages = Array.from(section.querySelectorAll<HTMLElement>(".journey-stage"));
    const spine = section.querySelector<SVGPathElement>("[data-spine-live]")!;
    const signal = section.querySelector<SVGCircleElement>("[data-signal]")!;
    const final = section.querySelector<SVGPathElement>("[data-final-live]")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false, frame = 0, dirty = true, latched = false, initialized = false, failed = false;
    const branchLengths: number[] = [];
    const uploadPath = section.querySelector<SVGPathElement>("[data-upload-path]");
    const uploadCopy = section.querySelector<SVGGElement>("[data-upload-copy]");
    const pointerCapable = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 761px)");
    let pointerX = 0, pointerY = 0, uploadLength = 1;
    let nodeYs: number[] = [], start = 0, length = 1, finalLength = 1, spineX = 0;
    const reveal = () => { if (!latched) { latched = true; setRevealed(true); } };
    const measure = () => {
      const bounds = route.getBoundingClientRect();
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      spineX = mobile ? 21 : bounds.width / 2;
      nodeYs = stages.map(stage => { const b = stage.querySelector("[data-node]")!.getBoundingClientRect(); return b.top + b.height / 2 - bounds.top; });
      start = Math.max(0, nodeYs[0] - 105);
      const end = nodeYs[4];
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      const d = `M${spineX} ${start}V${end}`;
      spine.setAttribute("d", d); section.querySelector("[data-spine-base]")!.setAttribute("d", d);
      length = spine.getTotalLength();
      section.querySelector("[data-exit]")?.setAttribute("d", `M${spineX} ${end}V${bounds.height}`);
      stages.forEach((stage,i) => {
        const artwork = stage.querySelector(".journey-artwork")!.getBoundingClientRect();
        const target = mobile || i%2===0 ? artwork.left - bounds.left + artwork.width * .15 : artwork.right - bounds.left - artwork.width * .15;
        const direction = target > spineX ? 1 : -1;
        const y = nodeYs[i];
        const branch = mobile
          ? `M${spineX} ${y}V${artwork.top-bounds.top+artwork.height*.5}H${target}`
          : `M${spineX} ${y}H${spineX+direction*35}L${spineX+direction*65} ${y+30}H${target}`;
        section.querySelector(`[data-branch-base="${i}"]`)!.setAttribute("d",branch);
        const live = section.querySelector<SVGPathElement>(`[data-branch-live="${i}"]`)!;
        live.setAttribute("d",branch);
        // Normalized pathLength makes dashes independent of route length.
        branchLengths[i] = live.getTotalLength();
      });
      const cta = section.querySelector(".procedure-cta-slot")!.getBoundingClientRect();
      const finalD = `M${spineX} ${end}V${cta.top-bounds.top-24}H${cta.left-bounds.left+cta.width/2}V${cta.top-bounds.top}`;
      final.setAttribute("d",finalD); section.querySelector("[data-final-base]")!.setAttribute("d",finalD);
      finalLength = final.getTotalLength();
      uploadLength = uploadPath?.getTotalLength() || 1;
      dirty = false;
    };
    const failOpen = () => {
      failed = true;
      section.dataset.journeyStatic = "true";
      setReady(false); reveal();
    };
    const update = () => {
      frame = 0;
      if (disposed || failed) return;
      try {
        if (dirty) measure();
        const isReduced = reduced.matches;
        section.dataset.journeyStatic = String(isReduced);
        const bounds = route.getBoundingClientRect();
        const signalY = clamp(window.innerHeight*.65 + (isReduced || !pointerCapable.matches ? 0 : pointerY * 24) - bounds.top, start, start+length+finalLength);
        const progress = clamp((signalY-start)/Math.max(1,length+finalLength));
        const distance = progress * (length+finalLength);
        section.style.setProperty("--clock-angle", `${-120 + clamp((signalY-nodeYs[0]) / Math.max(1,nodeYs[4]-nodeYs[0])) * 240}deg`);
        section.style.setProperty("--pointer-x", `${isReduced || !pointerCapable.matches ? 0 : pointerX * 3}deg`);
        section.style.setProperty("--pointer-y", `${isReduced || !pointerCapable.matches ? 0 : -pointerY * 3}deg`);
        spine.style.strokeDashoffset = String(isReduced ? 0 : 1-clamp(distance/length));
        const point = distance <= length ? spine.getPointAtLength(distance) : final.getPointAtLength(distance-length);
        signal.setAttribute("cx",String(point.x)); signal.setAttribute("cy",String(point.y));
        stages.forEach((stage,i) => {
          const state = journeyState(signalY,nodeYs[i]);
          stage.dataset.active = String(!isReduced && state.emphasis > .35);
          stage.dataset.reached = String(isReduced || state.reached);
          stage.style.setProperty("--stage-action",String(isReduced ? 1 : state.action));
          stage.style.setProperty("--stage-emphasis",String(isReduced ? 0 : state.emphasis));
          if (i === 1 && uploadPath && uploadCopy) {
            const t = isReduced ? 1 : state.action;
            const point = uploadPath.getPointAtLength(t * uploadLength);
            uploadCopy.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${-12 + t * 24})`);
            uploadCopy.style.opacity = String(t > .02 && t < .98 && !isReduced ? 1 : 0);
            uploadPath.style.strokeDashoffset = String(1-t);
            stage.querySelectorAll<SVGCircleElement>("[data-server-led]").forEach((led, index) => led.style.fill = t >= .55+index*.15 ? "#fd9c36" : "#0357d6");
          }
          const branch = section.querySelector<SVGPathElement>(`[data-branch-live="${i}"]`)!;
          const branchProgress = clamp((signalY-nodeYs[i])/Math.max(1,branchLengths[i])*2);
          branch.style.strokeDashoffset = String(isReduced ? 0 : 1-branchProgress);
        });
        final.style.strokeDashoffset = String(isReduced ? 0 : 1-clamp((distance-length)/Math.max(1,finalLength)));
        if (signalY >= nodeYs[4] || isReduced) reveal();
        if (!initialized) {
          initialized = true;
          if (document.activeElement === section.querySelector(".procedure-cta")) reveal();
          setReady(true);
        }
      } catch { failOpen(); }
    };
    const schedule = () => { if (!disposed && !failed && !frame) frame = requestAnimationFrame(update); };
    const pointer = (event: PointerEvent) => {
      if (!pointerCapable.matches || reduced.matches) return;
      pointerX = clamp(event.clientX / window.innerWidth * 2 - 1, -1, 1);
      pointerY = clamp(event.clientY / window.innerHeight * 2 - 1, -1, 1); schedule();
    };
    const leave = () => { pointerX = pointerY = 0; schedule(); };
    const resize = () => { dirty = true; schedule(); };
    let observer: ResizeObserver | undefined;
    try {
      observer = new ResizeObserver(resize);
      observer.observe(route); stages.forEach(stage=>observer!.observe(stage));
      window.addEventListener("scroll",schedule,{passive:true});
      section.addEventListener("pointermove",pointer,{passive:true}); section.addEventListener("pointerleave",leave);
      window.addEventListener("resize",resize); reduced.addEventListener("change",resize);
      document.fonts?.ready.then(()=>{ if(!disposed) resize(); });
      schedule();
    } catch { queueMicrotask(()=>{if(!disposed) failOpen();}); }
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer?.disconnect();
      window.removeEventListener("scroll",schedule); window.removeEventListener("resize",resize); reduced.removeEventListener("change",resize);
      section.removeEventListener("pointermove",pointer); section.removeEventListener("pointerleave",leave);
      delete section.dataset.journeyStatic;
      stages.forEach(stage=>{ delete stage.dataset.active; delete stage.dataset.reached; stage.style.removeProperty("--stage-action"); stage.style.removeProperty("--stage-emphasis"); });
    };
  },[sectionRef]);
  return {ready,ctaVisible:!ready || revealed};
}
