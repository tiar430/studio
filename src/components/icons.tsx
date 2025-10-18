export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 16.5 18 20l-3.5 3.5" />
      <path d="m9.5 7.5-3.5 3.5 3.5 3.5" />
      <path d="M18 10V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3" />
      <path d="M6 14v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" />
    </svg>
  );