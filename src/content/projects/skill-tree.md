---
title: Skill Tree
tagline: A hexagonal RPG skill tree built with NoesisGUI and C++
kind: personal
year: 2026
tags: [C++, NoesisGUI, XAML, MVVM]
repo: https://github.com/wladimirhernandez/skill-tree-concept
card: ../../assets/projects/skill-tree/applied.png
cardAlt: Hexagonal skill tree with gold acquired nodes around the centre and red locked nodes at the edges
hero: ../../assets/projects/skill-tree/applied.png
heroAlt: Skill tree after applying two purchases, with the new nodes outlined in gold and the mind shards counter at zero
gallery:
  - src: ../../assets/projects/skill-tree/buy-tooltip.png
    alt: A node being bought, with its tooltip showing the description and the shard cost
flag: New
order: 0
---

An RPG skill tree built with the NoesisGUI native C++ SDK: XAML for the visuals, C++ ViewModels for the nodes, links and purchase rules.

Nodes are locked, available, pending or owned. Buying a node spends mind shards and reveals its neighbours; clicking a pending node refunds it, along with everything that depended on it. ENTER applies the purchases and ESC discards them.

Every state change animates: locked nodes fade from red to white, a bought node pops with a double shockwave and a breathing gold halo, applying stamps it in place, and energy runs along the links. Denied clicks shake the node and flash the shard counter. Glows use radial gradients instead of blur effects, which ran out of NoesisGUI's offscreen render targets.

The layout follows Łukasz Wronka's ArtStation concept [Skill Tree](https://www.artstation.com/artwork/6NGdvn); the code and the icons are my own.
