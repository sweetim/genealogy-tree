import * as d3 from "d3";
import { createRef, useEffect } from "react";

interface FamilyTreeNode {
  name: string;
  children?: FamilyTreeNode[];
}

type FamilyTreeProps = {
  data: FamilyTreeNode
}

function FamilyTree({ data }: FamilyTreeProps) {
  function createFamilyTree(container: HTMLElement) {
    const width = 1800;
    const height = 1000;

    const root = d3.hierarchy(data);
    const dx = 100;
    const dy = width / (root.height + 10);

    const tree = d3.tree<FamilyTreeNode>().nodeSize([dx, dy]);
    // root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)

    svg.append("g")

      .attr("transform", "translate(" + width / 2 + "," + 20 + ")")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", (d) => {
        const linkGenerator = d3
          .linkVertical<d3.HierarchyPointLink<FamilyTreeNode>, [number, number]>()
          .source((d) => [d.source.x, d.source.y])
          .target((d) => [d.target.x, d.target.y]);
        return linkGenerator(d as d3.HierarchyPointLink<FamilyTreeNode>);
      });

    const node = svg.append("g")

      .attr("transform", "translate(" + width / 2 + "," + 20 + ")")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(tree(root).descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("y", d => d.children ? -12 : 12)
      .attr("text-anchor", _ => "middle")
      .text(d => d.data.name)
      .clone(true).lower()
      .attr("stroke", "white");

    container.append(svg.node()!);
  }

  const containerRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (containerRef.current) {
      createFamilyTree(containerRef.current)
    }
  }, [containerRef])

  return (
    <div ref={containerRef}></div>
  )
}

export default FamilyTree
