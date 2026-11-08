---
tagline: Un árbol de habilidades hexagonal de RPG hecho con NoesisGUI y C++
cardAlt: Árbol de habilidades hexagonal con nodos adquiridos en dorado en el centro y nodos bloqueados en rojo en los bordes
heroAlt: Árbol de habilidades después de aplicar dos compras, con los nodos nuevos marcados en dorado y el contador de mind shards en cero
galleryAlts:
  - Un nodo comprándose, con su tooltip que muestra la descripción y el costo en shards
---

Un árbol de habilidades de RPG hecho con el SDK nativo de NoesisGUI en C++: XAML para la parte visual y ViewModels en C++ para los nodos, los enlaces y las reglas de compra.

Los nodos pueden estar bloqueados, disponibles, pendientes o adquiridos. Comprar un nodo gasta mind shards y revela a sus vecinos; hacer clic en un nodo pendiente lo reembolsa, junto con todo lo que dependía de él. ENTER confirma las compras y ESC las descarta.

Cada cambio de estado tiene su animación: los nodos bloqueados pasan de rojo a blanco, un nodo comprado salta con una doble onda expansiva y un halo dorado que respira, aplicar lo fija en su lugar y la energía recorre los enlaces. Los clics denegados sacuden el nodo y hacen destellar el contador de shards. Los brillos usan degradados radiales en lugar de efectos de blur, que agotaban los render targets offscreen de NoesisGUI.

El diseño sigue el concepto de ArtStation [Skill Tree](https://www.artstation.com/artwork/6NGdvn) de Łukasz Wronka; el código y los íconos son míos.
