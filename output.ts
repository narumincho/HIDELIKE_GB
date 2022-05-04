import * as fs from "fs/promises";

const data = [
  {
    char: "A",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "B",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "C",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "D",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "E",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "F",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "G",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "H",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "I",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "J",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "K",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "L",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "M",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "N",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "O",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "P",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "Q",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM4 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "R",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM4 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "S",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "T",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "U",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "V",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "W",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "X",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "Y",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "Z",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "0",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "1",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM1 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "2",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM6 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "3",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "4",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM2 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "5",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "6",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "7",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM5 3 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM4 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "8",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "9",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "a",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "b",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "c",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "d",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M5 1 h1v1h-1zM6 1 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "e",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "f",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M4 1 h1v1h-1zM5 1 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM6 2 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "g",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "h",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "i",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "j",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M4 1 h1v1h-1zM5 1 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "k",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "l",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "m",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM4 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM4 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM4 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "n",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "o",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "p",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "q",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "r",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "s",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "t",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM6 5 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "u",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "v",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "w",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM4 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM4 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "x",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "y",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "z",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "[",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "]",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "-",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "■",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M1 1 h1v1h-1zM2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM6 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM5 4 h1v1h-1zM6 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM6 5 h1v1h-1zM1 6 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1zM6 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "!",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM3 2 h1v1h-1zM4 2 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "🕒",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM2 2 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM1 3 h1v1h-1zM2 3 h1v1h-1zM4 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM2 4 h1v1h-1zM6 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "(",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM2 2 h1v1h-1zM3 2 h1v1h-1zM2 3 h1v1h-1zM2 4 h1v1h-1zM2 5 h1v1h-1zM3 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: ")",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 1 h1v1h-1zM4 1 h1v1h-1zM4 2 h1v1h-1zM5 2 h1v1h-1zM5 3 h1v1h-1zM5 4 h1v1h-1zM4 5 h1v1h-1zM5 5 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: ":",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M3 2 h1v1h-1zM4 2 h1v1h-1zM3 5 h1v1h-1zM4 5 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "@",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM2 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM3 3 h1v1h-1zM4 3 h1v1h-1zM6 3 h1v1h-1zM1 4 h1v1h-1zM3 4 h1v1h-1zM5 4 h1v1h-1zM1 5 h1v1h-1zM2 5 h1v1h-1zM4 5 h1v1h-1zM2 6 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1zM5 6 h1v1h-1z"/>\n</svg>',
  },
  {
    char: "?",
    dotList:
      '<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">\n<path fill="#000" d="M2 1 h1v1h-1zM3 1 h1v1h-1zM4 1 h1v1h-1zM5 1 h1v1h-1zM1 2 h1v1h-1zM5 2 h1v1h-1zM6 2 h1v1h-1zM1 3 h1v1h-1zM5 3 h1v1h-1zM6 3 h1v1h-1zM3 4 h1v1h-1zM4 4 h1v1h-1zM3 6 h1v1h-1zM4 6 h1v1h-1z"/>\n</svg>',
  },
];

data.map((d) =>
  fs.writeFile(
    "./font-svg/" +
      (d.char.match(/[a-z]/gu)
        ? "lower-" + d.char
        : d.char.match(/[A-Z]/gu)
        ? "upper-" + d.char
        : d.char.replace(
            /[\\/:*?"<>|]/gu,
            d.char.codePointAt(0)?.toString(16) ?? "nazo"
          )) +
      ".svg",
    d.dotList + "\n"
  )
);
