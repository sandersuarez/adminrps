import * as React from 'react';
import { SVGProps } from 'react';

const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 330 330'
    xmlSpace='preserve'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='M325.61 304.39 223.33 202.11c16.707-21.256 26.683-48.041 26.683-77.111 0-68.929-56.077-125.01-125.01-125.01-68.928 0-125 56.077-125 125.01 0 68.927 56.077 125 125 125 29.07 0 55.855-9.975 77.11-26.681l102.28 102.28c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.859-5.857 5.859-15.355 0-21.212zM30 125c0-52.387 42.619-95.006 95.005-95.006 52.387 0 95.006 42.619 95.006 95.005s-42.619 95.004-95.006 95.004C72.619 220.004 30 177.385 30 125z' />
  </svg>
);

export default SvgSearch;
