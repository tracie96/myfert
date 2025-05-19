import React from 'react';

const ViewMoreButton = () => {
  return (
    <div className="view-more">
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              "<svg id='1896:31196' width='110' height='21' viewBox='0 0 110 21' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' class='view-more-icon' style='width: 110px; height: 21px; margin-right: 10px'> <text fill='#00ADEF' xml:space='preserve' style='white-space: pre' font-family='Inter' font-size='13' font-weight='bold' letter-spacing='0em'><tspan x='30.7617' y='12.7273'>View More</tspan></text> <mask id='mask0_1896_31196' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='16' height='16'> <rect x='16' y='16' width='16' height='16' transform='rotate(180 16 16)' fill='url(#pattern0_1896_31196)'></rect> </mask> <g mask='url(#mask0_1896_31196)'> <path d='M16 21H0V5H16V21Z' fill='#00ADEF'></path> </g> <defs> <pattern id='pattern0_1896_31196' patternContentUnits='objectBoundingBox' width='1' height='1'> <use xlink:href='#image0_1896_31196' transform='scale(0.0625)'></use> </pattern>  </defs> </svg>",
          }}
        />
      </div>
      <span>View More</span>
    </div>
  );
};

export default ViewMoreButton; 