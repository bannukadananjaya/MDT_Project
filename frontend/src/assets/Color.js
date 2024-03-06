export const Color = {
  VIOLET: "#ed31E4",
  RED: "#ED0C27",
  ORANGE: "#ED930C",
  YELLOW: "#FBF73D",
  LIGHT_GREEN: "#26F81B",
  GREEN:"#378805",
  BLUE: "#1B9CF8",
  BLACK: "#000",
  WHITE: "#fff",
};



export const FindOverlappingColor = (overlapping) => {
  if (overlapping && !isNaN(overlapping)) {
    switch (true) {
      case overlapping >= 70:
        return Color.VIOLET;
      case overlapping >= 50:
        return Color.RED;
      case overlapping >= 43:
        return Color.ORANGE;
      case overlapping >= 30:
        return Color.YELLOW;
      case overlapping >= 20:
        return Color.LIGHT_GREEN;
      case overlapping >= 1:
        return Color.BLACK;
      default:
        return Color.WHITE;
    }
  }
  return Color.WHITE;
};


export const FindRSRPColor = (rsrp) => {
  if (rsrp && !isNaN(rsrp)) {
    switch (true) {
      case rsrp <-115:
        return Color.RED;
      case rsrp <-105:
        return Color.ORANGE;
      case rsrp <-100:
        return Color.YELLOW;
      case rsrp <-85:
        return Color.LIGHT_GREEN;
      case rsrp >= -85:
        return Color.GREEN;
      default:
        return Color.WHITE;
    }
  }
  return Color.WHITE;
};