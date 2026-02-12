'use client';
export default function Spark(props) {
  var data = props.data;
  var color = props.color || 'var(--ac)';
  var w = props.w || 100;
  var h = props.h || 28;
  var showDot = props.showDot;

  if (!data || data.length < 2) return null;
  var mn = Math.min.apply(null, data);
  var mx = Math.max.apply(null, data);
  var r = mx - mn || 1;
  var pad = 3;

  var pts = data.map(function(v, i) {
    var x = (i / (data.length - 1)) * w;
    var y = h - ((v - mn) / r) * (h - pad * 2) - pad;
    return x + ',' + y;
  }).join(' ');

  var lastX = w;
  var lastY = h - ((data[data.length - 1] - mn) / r) * (h - pad * 2) - pad;
  var resolvedColor = color.indexOf('var(') === 0 ? '#00d4ff' : color;
  var id = 'sf' + resolvedColor.replace(/#/g, '').replace(/[^a-zA-Z0-9]/g, '') + w + h;

  return (
    <svg width="100%" height={h} viewBox={'0 0 ' + w + ' ' + h} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={'0,' + h + ' ' + pts + ' ' + w + ',' + h} fill={'url(#' + id + ')'} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {showDot && (
        <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      )}
    </svg>
  );
}
