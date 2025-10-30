if (!window.React || !window.d3 || !window.framerMotion) {
  throw new Error(
    "TechnicalHealthTreeDiagram requires React, d3, and Framer Motion to be loaded before this script."
  );
}

const { useEffect, useMemo, useRef, useState } = window.React;
const { hierarchy, tree, linkHorizontal } = window.d3;
const { motion, AnimatePresence } = window.framerMotion;

// -----------------------------------------------------------------------------
// Example hierarchical dataset following the required schema. This can be
// replaced by live data coming from Salesforce or any API layer.
// -----------------------------------------------------------------------------
const exampleTechnicalHealthData = {
  category: "Technical Health",
  weight: 100,
  children: [
    {
      name: "Efficiency",
      weight: 52,
      children: [
        {
          name: "User Experience Efficiency",
          weight: 35,
          signals: [
            { name: "Concurrent UI Errors", score: 64 },
            { name: "EPT Page Load Time", score: 72 },
            { name: "Lightning CPU Time", score: 58 }
          ]
        },
        {
          name: "Automation Efficiency",
          weight: 30,
          signals: [
            { name: "Flow Fault Rate", score: 82 },
            { name: "Failed Batch Jobs", score: 74 }
          ]
        },
        {
          name: "Performance & Scale",
          weight: 35,
          signals: [
            { name: "SOQL Query Rows", score: 66 },
            { name: "Apex CPU Time", score: 71 },
            { name: "Storage Utilization", score: 88 }
          ]
        }
      ]
    },
    {
      name: "Operational Excellence",
      weight: 28,
      children: [
        {
          name: "Release Management",
          weight: 45,
          signals: [
            { name: "Deployment Success Rate", score: 68 },
            { name: "Change Failure Rate", score: 74 }
          ]
        },
        {
          name: "Testing & QA",
          weight: 30,
          signals: [
            { name: "Automated Test Coverage", score: 54 },
            { name: "Regression Escape Rate", score: 61 }
          ]
        },
        {
          name: "Governance",
          weight: 25,
          signals: [
            { name: "Critical Permission Overrides", score: 72 },
            { name: "Security Review Age", score: 79 }
          ]
        }
      ]
    },
    {
      name: "Customization",
      weight: 10,
      children: [
        {
          name: "Configuration Discipline",
          weight: 55,
          signals: [
            { name: "Active Validation Rules", score: 62 },
            { name: "Active Workflow Rules", score: 57 }
          ]
        },
        {
          name: "Code Quality",
          weight: 45,
          signals: [
            { name: "Static Code Violations", score: 48 },
            { name: "Average Cyclomatic Complexity", score: 52 }
          ]
        }
      ]
    },
    {
      name: "Observability",
      weight: 10,
      children: [
        {
          name: "Monitoring",
          weight: 50,
          signals: [
            { name: "Error Spike Detection", score: 83 },
            { name: "APM Coverage", score: 77 }
          ]
        },
        {
          name: "Alert Hygiene",
          weight: 50,
          signals: [
            { name: "Mean Time to Acknowledge", score: 69 },
            { name: "Duplicate Alert Rate", score: 58 }
          ]
        }
      ]
    }
  ]
};

// -----------------------------------------------------------------------------
// Utility helpers for cloning, weighting, scoring, and color scales.
// -----------------------------------------------------------------------------
const clampScore = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const getScoreColor = (score) => {
  if (score >= 70) return "#22c55e"; // Tailwind green-500
  if (score >= 40) return "#f97316"; // Tailwind orange-500
  return "#ef4444"; // Tailwind red-500
};

const formatPercent = (value) => `${value.toFixed(1)}%`;

const collectAllIds = (node) => {
  const ids = [node.id];
  node.children.forEach((child) => {
    ids.push(...collectAllIds(child));
  });
  return ids;
};

const defaultExpandedSet = (node) => {
  const initial = new Set([node.id]);
  node.children.forEach((child) => initial.add(child.id));
  return initial;
};

// -----------------------------------------------------------------------------
// The normalizeHierarchy function reshapes the raw hierarchy into a fully
// normalized tree with calculated weights, scores, formulas, and unique IDs.
// -----------------------------------------------------------------------------
const normalizeHierarchy = (rawData) => {
  const assign = (node, parentPath = "", weightValue = 100, parentTotal = 100) => {
    const name = node.name || node.category || node.label || "Node";
    const id = parentPath ? `${parentPath}::${name}` : name;
    const normalized = parentPath ? (parentTotal > 0 ? weightValue / parentTotal : 0) : 1;
    const weightPercent = normalized * 100;

    // Collect children or signals and ensure the structure is consistent.
    let rawChildren = Array.isArray(node.children) ? node.children : [];
    if ((!rawChildren || rawChildren.length === 0) && Array.isArray(node.signals)) {
      rawChildren = node.signals.map((signal) => ({ ...signal, type: "signal" }));
    }

    // Determine fallback weights for any child that is missing a value.
    let providedSum = 0;
    let missingCount = 0;
    rawChildren.forEach((child) => {
      if (child.weight == null) {
        missingCount += 1;
      } else {
        providedSum += Number(child.weight) || 0;
      }
    });

    let defaultWeight = 0;
    if (rawChildren.length > 0) {
      if (missingCount === rawChildren.length) {
        // Even distribution when no weights are supplied.
        defaultWeight = 100 / rawChildren.length;
        providedSum = 100;
      } else if (missingCount > 0) {
        const remaining = Math.max(100 - providedSum, 0);
        defaultWeight = remaining > 0 ? remaining / missingCount : providedSum / rawChildren.length;
        providedSum += defaultWeight * missingCount;
      }
    }

    const totalChildWeight = providedSum || 100;

    // Recursively prepare children and compute weighted scores.
    const preparedChildren = rawChildren.map((child) => {
      const childWeightValue = child.weight != null ? Number(child.weight) : defaultWeight;
      return assign(child, id, childWeightValue, totalChildWeight);
    });

    const hasChildren = preparedChildren.length > 0;
    const computedScore = hasChildren
      ? preparedChildren.reduce((sum, child) => sum + child.score * child.weightNormalized, 0)
      : clampScore(node.score);

    return {
      ...node,
      name,
      id,
      weightValue,
      weightPercent,
      weightNormalized: normalized,
      score: clampScore(hasChildren ? computedScore : node.score),
      formula: hasChildren
        ? `${name} = ${preparedChildren
            .map((child) => `${child.name} × ${formatPercent(child.weightPercent)}`)
            .join(" + ")}`
        : `${name} signal score`,
      children: preparedChildren,
      type: hasChildren ? node.type || "composite" : "signal"
    };
  };

  return assign(deepClone(rawData));
};

// -----------------------------------------------------------------------------
// SVG layout helpers for generating the horizontal tree structure.
// -----------------------------------------------------------------------------
const NODE_VERTICAL_SPACING = 92;
const COLUMN_WIDTH = 260;
const BAR_HEIGHT = 44;
const BAR_MIN_WIDTH = 96;
const BAR_MAX_WIDTH = 260;

const getBarWidth = (node) => {
  if (node.depth === 0) {
    return 320;
  }
  const normalized = node.data.weightNormalized ?? 0;
  return Math.max(BAR_MIN_WIDTH, normalized * BAR_MAX_WIDTH);
};

const getScoreLabel = (score) => `${score.toFixed(1)}`;

// -----------------------------------------------------------------------------
// TechnicalHealthTreeDiagram Component
// -----------------------------------------------------------------------------
const TechnicalHealthTreeDiagram = ({ data = exampleTechnicalHealthData }) => {
  const normalizedTree = useMemo(() => normalizeHierarchy(data), [data]);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [showVisualAid, setShowVisualAid] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  // Initialize expanded state whenever the dataset changes.
  useEffect(() => {
    if (!normalizedTree) return;
    setExpandedIds(defaultExpandedSet(normalizedTree));
    setShowVisualAid(false);
  }, [normalizedTree]);

  // Helper to toggle a node open/closed.
  const handleNodeToggle = (node) => {
    if (!node.data.children || node.data.children.length === 0) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.data.id)) {
        if (node.data.id !== normalizedTree.id) {
          next.delete(node.data.id);
        }
      } else {
        next.add(node.data.id);
      }
      next.add(normalizedTree.id);
      return next;
    });
    setShowVisualAid(false);
  };

  const handleVisualAidToggle = () => {
    if (!normalizedTree) return;
    setShowVisualAid((prev) => {
      const next = !prev;
      setExpandedIds(next ? new Set(collectAllIds(normalizedTree)) : defaultExpandedSet(normalizedTree));
      return next;
    });
  };

  const handlePointerMove = (event, node) => {
    if (!svgRef.current || !containerRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: event.clientX - containerRect.left - 20,
      y: event.clientY - containerRect.top + 20,
      node: node.data,
      svgX: event.clientX - svgRect.left,
      svgY: event.clientY - svgRect.top
    });
  };

  const hideTooltip = () => setTooltip(null);

  // Build the filtered hierarchy with the current expansion map.
  const layout = useMemo(() => {
    if (!normalizedTree) return null;
    const filteredRoot = hierarchy(normalizedTree, (d) =>
      expandedIds.has(d.id) || d.id === normalizedTree.id ? d.children : null
    );

    const layoutTree = tree().nodeSize([NODE_VERTICAL_SPACING, COLUMN_WIDTH]);
    layoutTree(filteredRoot);

    let minX = Infinity;
    let maxX = -Infinity;
    let maxDepth = 0;

    filteredRoot.each((node) => {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      maxDepth = Math.max(maxDepth, node.depth);
      node.y = node.depth * COLUMN_WIDTH;
    });

    const verticalOffset = -minX + NODE_VERTICAL_SPACING;
    filteredRoot.each((node) => {
      node.x += verticalOffset;
    });

    const height = Math.max(maxX - minX + NODE_VERTICAL_SPACING * 2, filteredRoot.descendants().length * 70);
    const width = (maxDepth + 1) * COLUMN_WIDTH + 360;

    return {
      nodes: filteredRoot.descendants(),
      links: filteredRoot.links(),
      width,
      height
    };
  }, [expandedIds, normalizedTree]);

  const linkPath = useMemo(() => linkHorizontal().x((d) => d.x).y((d) => d.y), []);

  if (!layout) {
    return null;
  }

  return (
    <div ref={containerRef} className="technical-health-tree-card">
      <div className="technical-health-tree-header">
        <div>
          <h2 className="technical-health-tree-title">Technical Health Tree Diagram</h2>
          <p className="technical-health-tree-subtitle">
            Interactive visualization of the weighted Technical Health Score calculation.
          </p>
        </div>
        <button
          onClick={handleVisualAidToggle}
          className={`technical-health-tree-toggle${showVisualAid ? " is-active" : ""}`}
        >
          {showVisualAid ? "Collapse Visual Aid" : "Show Visual Aid"}
        </button>
      </div>

      <div className="technical-health-tree-canvas">
        <svg ref={svgRef} width={layout.width} height={layout.height} className="technical-health-tree-svg">
          {/* Connector paths */}
          <g fill="none" stroke="#cbd5f5" strokeWidth={1.5}>
            {layout.links.map((link) => {
              const parentWidth = getBarWidth(link.source);
              const source = {
                x: link.source.y + parentWidth,
                y: link.source.x + BAR_HEIGHT / 2
              };
              const target = {
                x: link.target.y,
                y: link.target.x + BAR_HEIGHT / 2
              };
              return <path key={`${link.target.data.id}-${link.source.data.id}`} d={linkPath({ source, target })} />;
            })}
          </g>

          {/* Node groups */}
          <AnimatePresence>
            {layout.nodes.map((node) => {
              const barWidth = getBarWidth(node);
              const progressWidth = Math.max(0, Math.min(barWidth, (node.data.score / 100) * barWidth));
              const scoreColor = getScoreColor(node.data.score);
              const isExpandable = node.data.children && node.data.children.length > 0;
              const isExpanded = expandedIds.has(node.data.id) || node.data.id === normalizedTree.id;

              return (
                <motion.g
                  className="technical-health-tree-node"
                  key={node.data.id}
                  initial={{ opacity: 0, transform: `translate(${node.y}px, ${node.x}px)` }}
                  animate={{ opacity: 1, transform: `translate(${node.y}px, ${node.x}px)` }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <g
                    className="technical-health-tree-node-group"
                    onClick={() => handleNodeToggle(node)}
                    onMouseMove={(event) => handlePointerMove(event, node)}
                    onMouseLeave={hideTooltip}
                    role={isExpandable ? "button" : "presentation"}
                    tabIndex={isExpandable ? 0 : undefined}
                    onKeyDown={(event) => {
                      if (isExpandable && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        handleNodeToggle(node);
                      }
                    }}
                  >
                    {/* Expand/Collapse indicator */}
                    {isExpandable && (
                      <g
                        transform={`translate(-18, ${BAR_HEIGHT / 2 - 6}) rotate(${isExpanded ? 90 : 0}, 6, 6)`}
                      >
                        <path d="M0 0 L12 6 L0 12 Z" fill="#475569" />
                      </g>
                    )}

                    {/* Base bar */}
                    <rect
                      width={barWidth}
                      height={BAR_HEIGHT}
                      fill="#f8fafc"
                      stroke="#cbd5f5"
                      strokeWidth={1}
                      rx={12}
                    />

                    {/* Score progress fill */}
                    <motion.rect
                      width={progressWidth}
                      height={BAR_HEIGHT}
                      fill="url(#progress-gradient)"
                      rx={12}
                      initial={{ width: 0 }}
                      animate={{ width: progressWidth }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />

                    {/* Node title */}
                    <text x={16} y={20} className="technical-health-tree-node-title">
                      {node.data.name}
                    </text>

                    {/* Weight indicator */}
                    {node.depth > 0 && (
                      <text x={16} y={BAR_HEIGHT - 10} className="technical-health-tree-node-weight">
                        Weight {formatPercent(node.data.weightPercent)}
                      </text>
                    )}

                    {/* Score marker */}
                    <circle
                      cx={barWidth + 16}
                      cy={BAR_HEIGHT / 2}
                      r={9}
                      fill={scoreColor}
                      stroke="#0f172a"
                      strokeWidth={0.5}
                    />
                    <text x={barWidth + 32} y={BAR_HEIGHT / 2 + 4} className="technical-health-tree-node-score">
                      {getScoreLabel(node.data.score)}
                    </text>
                  </g>
                </motion.g>
              );
            })}
          </AnimatePresence>

          {/* Gradient definition for score fills */}
          <defs>
            <linearGradient id="progress-gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>

        {tooltip?.visible && tooltip.node && (
          <div className="technical-health-tree-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            <p className="technical-health-tree-tooltip-title">{tooltip.node.name}</p>
            <p className="technical-health-tree-tooltip-line">
              Weight: <span className="technical-health-tree-tooltip-value">{formatPercent(tooltip.node.weightPercent)}</span>
            </p>
            <p className="technical-health-tree-tooltip-line">
              Score: <span className="technical-health-tree-tooltip-value">{tooltip.node.score.toFixed(1)}</span>
            </p>
            <p className="technical-health-tree-tooltip-line technical-health-tree-tooltip-formula">
              {tooltip.node.formula}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

window.TechnicalHealthTreeDiagram = TechnicalHealthTreeDiagram;
if (typeof window.dispatchEvent === "function") {
  window.dispatchEvent(new Event("technical-health-tree-ready"));
}
