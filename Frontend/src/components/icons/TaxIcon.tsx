interface Props {
  readonly size?: number | string;
  readonly color?: string;
}

export default function TaxIcon({ size = 30, color = "white" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0336 26.3145H4.46899V28.9998H11.0336V26.3145Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.61074 23.6299H3.04617V26.3153H9.61074V23.6299Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9723 20.9443H4.40775V23.6297H10.9723V20.9443Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.61074 18.2578H3.04617V20.9432H9.61074V18.2578Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.9538 21.5554V22.6253C26.9538 26.1464 24.0998 29.0005 20.5787 29.0005H15.0322C13.5178 29.0005 12.1275 28.4729 11.0337 27.5908V26.3148H9.83287C9.75547 26.2056 9.68148 26.094 9.61091 25.9802V23.6298H10.9722V20.9442H9.61091V18.2592H9.57563C9.83913 17.8221 10.1573 17.4146 10.5243 17.0475L15.0316 11.9717H20.5799L25.0866 17.0475C26.2823 18.2432 26.9538 19.8646 26.9538 21.5554Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3687 7.15918H12.0622L15.0315 11.9702H20.5797L23.5489 7.15918H20.3748"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.674 17.9746L15.266 24.4036"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6237 20.0828C16.2878 20.0828 16.8262 19.5438 16.8262 18.8788C16.8262 18.2139 16.2878 17.6748 15.6237 17.6748C14.9596 17.6748 14.4212 18.2139 14.4212 18.8788C14.4212 19.5438 14.9596 20.0828 15.6237 20.0828Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.2151 24.8416C20.8793 24.8416 21.4176 24.3025 21.4176 23.6376C21.4176 22.9726 20.8793 22.4336 20.2151 22.4336C19.551 22.4336 19.0126 22.9726 19.0126 23.6376C19.0126 24.3025 19.551 24.8416 20.2151 24.8416Z"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.21942 10.3146V1"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.21304 3.00638L9.204 1L11.195 3.00638"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.1362 5.70703V14.9473"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.14264 12.9414L5.15163 14.9478L3.16067 12.9414"
        stroke="#2473BD"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.8625" cy="7.15993" r="0.569106" fill="#2473BD" />
    </svg>
  );
}
