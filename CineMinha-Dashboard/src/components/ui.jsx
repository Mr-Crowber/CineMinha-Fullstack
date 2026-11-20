import Icon from "./Icon";

export function Button({ children, onClick, variant = "primary", size = "md", type = "button", disabled = false, icon, className = "" }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`button button-${variant} button-${size} ${className}`.trim()}>
    {icon && <Icon name={icon} size={16}/>}<span>{children}</span>
  </button>;
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return <div className="page-header">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>
    {actions && <div className="page-actions">{actions}</div>}
  </div>;
}

export function Panel({ title, subtitle, actions, children, className = "" }) {
  return <section className={`panel ${className}`}><div className="panel-header"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div>{actions}</div>{children}</section>;
}

export function StatusBadge({ children, tone = "neutral" }) {
  return <span className={`status-badge status-${tone}`}><i/>{children}</span>;
}

export function StatCard({ label, value, note, icon, tone = "purple" }) {
  return <article className="stat-card"><div className="stat-card-top"><span>{label}</span><div className={`stat-icon tone-${tone}`}><Icon name={icon} size={18}/></div></div><strong>{value}</strong><small>{note}</small></article>;
}

export function Field({ label, hint, required, children, className = "" }) {
  return <label className={`field ${className}`}><span className="field-label">{label}{required && <b> *</b>}</span>{children}{hint && <small className="field-hint">{hint}</small>}</label>;
}

export function TextInput({ label, hint, required, className = "", ...props }) {
  return <Field label={label} hint={hint} required={required} className={className}><input className="text-input" {...props}/></Field>;
}

export function SelectInput({ label, hint, required, options, className = "", ...props }) {
  return <Field label={label} hint={hint} required={required} className={className}><select className="text-input" {...props}>{options.map((item) => <option key={item.value ?? item} value={item.value ?? item}>{item.label ?? item}</option>)}</select></Field>;
}

export function TextArea({ label, hint, required, className = "", ...props }) {
  return <Field label={label} hint={hint} required={required} className={className}><textarea className="text-input text-area" {...props}/></Field>;
}

export function EmptyState({ icon = "film", title, description, action }) {
  return <div className="empty-state"><div><Icon name={icon} size={25}/></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function Modal({ title, description, onClose, children, footer }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close"/></button></header>
      <div className="modal-content">{children}</div>
      {footer && <footer className="modal-footer">{footer}</footer>}
    </section>
  </div>;
}

export function SearchBox({ value, onChange, placeholder = "Buscar..." }) {
  return <label className="search-box"><Icon name="search" size={16}/><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder}/></label>;
}
