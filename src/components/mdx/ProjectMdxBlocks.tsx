import React from "react";

type FunctionTableProps = {
  caption?: string;
  columns?: string[];
  rows?: string[][];
};

export function FunctionTable({
  caption,
  columns = [],
  rows = [],
}: FunctionTableProps) {
  if (!Array.isArray(columns) || !Array.isArray(rows)) {
    return null;
  }

  if (columns.length === 0 || rows.length === 0) {
    return null;
  }

  return (
    <figure style={{ margin: "24px 0", width: "100%" }}>
      {caption && (
        <figcaption
          style={{
            marginBottom: "10px",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          {caption}
        </figcaption>
      )}

      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`heading-${index}`}
                  style={{
                    border: "1px solid var(--neutral-border-medium, #d9d9d9)",
                    padding: "10px 12px",
                    textAlign: "left",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {columns.map((_, cellIndex) => (
                  <td
                    key={`cell-${rowIndex}-${cellIndex}`}
                    style={{
                      border: "1px solid var(--neutral-border-medium, #d9d9d9)",
                      padding: "10px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    {row[cellIndex] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

type MathVariable = {
  symbol: string;
  meaning: string;
  unit?: string;
};

type MathEquationProps = {
  title?: string;
  label?: string;
  formula?: string;
  variables?: MathVariable[];
};

export function MathEquation({ title, label, formula, variables = [] }: MathEquationProps) {
  if (!formula) {
    return null;
  }

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "14px 16px",
        border: "1px solid var(--neutral-border-medium, #d9d9d9)",
        borderRadius: "12px",
        overflowX: "auto",
      }}
    >
      {(title || label) && (
        <div
          style={{
            marginBottom: "8px",
            fontWeight: 600,
            fontSize: "0.9rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          {title && <span>{title}</span>}
          {label && <span style={{ opacity: 0.7 }}>{label}</span>}
        </div>
      )}

      <code
        style={{
          fontSize: "1rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {formula}
      </code>

      {Array.isArray(variables) && variables.length > 0 && (
        <ul
          style={{
            marginTop: "10px",
            marginBottom: 0,
            paddingLeft: "20px",
            fontSize: "0.85rem",
            lineHeight: 1.6,
          }}
        >
          {variables.map((variable, index) => (
            <li key={`${variable.symbol}-${index}`}>
              <code>{variable.symbol}</code>: {variable.meaning}
              {variable.unit ? ` [${variable.unit}]` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}