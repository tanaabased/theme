---
title: Theme
description: A tech workshop for special projects.
sidebar: true
editLink: false
prev: false
next: false
---

# The Tanaab Based Style

<nav class="homepage-grid" aria-label="Main documentation sections">
  <a class="homepage-tile" href="/styleguide/">
    <span class="homepage-label">Styleguide</span>
  </a>
  <a class="homepage-tile" href="/components/">
    <span class="homepage-label">Components</span>
  </a>
  <a class="homepage-tile" href="/containers/">
    <span class="homepage-label">Containers</span>
  </a>
  <a class="homepage-tile" href="/usage/">
    <span class="homepage-label">Usage</span>
  </a>
</nav>

<style lang="scss" scoped>
.homepage-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  margin: 0;
  padding: 0;
  padding-top: 2em;
}

.homepage-tile {
  display: flex;
  flex: auto;
  width: 100%;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: var(--vp-sidebar-bg-color);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    background-color 180ms ease,
    color 180ms ease;
}

.homepage-tile:hover,
.homepage-tile:focus-visible {
  background-color: var(--tanaab-color-primary);
  color: #fff;
}

.homepage-label {
  font-family: var(--tanaab-font-family-heading);
  font-size: clamp(1.25rem, 3vw, 2.1rem);
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: 1.1;
  text-align: center;
  text-transform: uppercase;
}

.homepage-tile:focus-visible {
  outline: 2px solid #fff;
  outline-offset: -2px;
}

@media (min-width: 960px) {
  .homepage-tile {
    flex: auto;
    width: 48%;
  }
}
</style>
