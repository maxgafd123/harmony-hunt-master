<script>
    export let size = "w-6";
    export let color = "text-blue-500";
  </script>
  
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    class="animate-spin {size} {color}"
    style="width: 4em; height: 4em;"
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="currentColor"
      stroke-width="6" 
      r="40"
      stroke-dasharray="164.93361431346415 56.97787143782138"
      transform="rotate(277.743 50 50)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </circle>
  </svg>