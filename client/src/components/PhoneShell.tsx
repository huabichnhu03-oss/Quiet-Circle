type PhoneShellProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export function PhoneShell({ children, scrollable = false }: PhoneShellProps) {
  return (
    <div className="phone-shell">
      <div
        className={`phone-frame ${scrollable ? "overflow-y-auto overflow-x-hidden" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
