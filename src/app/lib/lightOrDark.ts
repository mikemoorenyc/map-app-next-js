function hexToRgb(hex:string):number[] {
  let r = 0, g = 0, b = 0;

  // Handle shorthand hex codes (e.g., #ABC)
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    // Handle full hex codes (e.g., #AABBCC)
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  
  return [r, g, b];
}



function lightOrDark(color:string) : "light"|"dark"{
  let rgb;
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    rgb = match ? match.map(Number) : [0, 0, 0];
  } else {
    // Assume hex and convert
    rgb = hexToRgb(color);
  }
  
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];

  // Calculate the relative luminance (Y)
  // Formula: 0.2126R + 0.7152G + 0.0722B
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // A common threshold is 0.5
  if(luminance > 0.5) {
    return "light"
  } else {
    return "dark"
  }

}

export default lightOrDark
