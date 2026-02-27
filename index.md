---
title: TMS
description: A tech workshop for special projects.
layout: home
sidebar: false
navbar: false
---

<div class="hero">
  <h1 aria-label="TANAAB MANEUVERING STYLES LLC">
    <span aria-hidden="true">TANAAB</span>
    <span aria-hidden="true">MANEUVERING</span>
    <span aria-hidden="true">STYLES</span>
    <span aria-hidden="true">LLC</span>
  </h1>
  <span class="byline">A tech workshop for special projects.</span>
  <div class="links">
    <a href="tel:+12024306826" title="Call Tanaab">CALL US</a> |
    <a href="mailto:sales@tanaab.dev" title="Email Tanaab">EMAIL US</a>
  </div>
  <footer>Copyright ©2025</footer>
</div>

<style lang="scss" scoped>
  .hero {
    padding: 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 8rem;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      line-height: 1.4;
      text-align: center;
      span {
        display: block;
      }
    }
    .byline {
      color: var(--vp-c-text-3);
      font-weight: 500;
      line-height: 1.33;
      margin: 0 0 1em;
      letter-spacing: -.08rem;
      font-size: 3em;
      text-align: center;
    }
    .links {
      display: flex;
      gap: 10px;
    }
    footer {
      padding-top: 2em;
      color: var(--vp-c-text-2);
    }
  }

@media (max-width: 768px) {
  .hero {
    padding: 2em;
    h1 {
      font-size: 4.5em;
    }
    .byline {
      font-size: 2.5em;
    }
  }
}

@media (max-width: 480px)   {
  .hero {
    padding: 1.5em;
    h1 {
      font-size: 3.5em;
    }
  }
}


</style>
