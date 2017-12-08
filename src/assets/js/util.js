function _createPathElement() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'path');
}

export function fix(num, degree = 2) {
  degree = Math.pow(10, degree)

  if (num instanceof Array) {
    num.map(function(value, i) {
      if (+value + '' === 'NaN') {
        return value 
      }
      return round(value * degree) / degree;
    });
  } else {
    num = round(num * degree) / degree;
  }
  return num;
}

function _binarySearch(array, des) { //用于定位des在array中的确切位置
  var low = 0;
  var high = array.length - 1;
  var middle;　　
  while (low <= high) {　　
    middle = (low + high) / 2;　　
    if (des == array[middle]) {　　
      return middle;　　
    } else if (des < array[middle]) {　　
      high = middle - 1;　　
    } else {　　
      low = middle + 1;　　
    }　　
  }　　
  return -1;
}

function _binarySearch2(array, des) { //用于定位des在array中所在区间的起始位置
  var low = 0;　　
  var high = array.length - 1;
  var middle;　

  while (low <= high) {　　
    middle = floor((low + high) * 0.5);

    if (des > array[middle]) {
      low = middle + 1;
    } else if (des <= array[middle]) {
      if (des > (array[middle - 1] || 0)) {
        return middle;
      } else {
        high = middle - 1;
      }
    }
  }

  if (low === middle) {
    return 0;
  } else if (middle === high) {
    return high;
  }　　
  return -1;
}

function _isArrayEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  } else {
    return array1.toString() === array2.toString();
  }
}

var g = require('./geometry')
var math = Math;
var sqrt = math.sqrt;
var pow = math.pow;
var max = math.max;
var min = math.min;
var abs = math.abs;
var round = math.round;
var sin = math.sin;
var cos = math.cos;
var tan = math.tan;
var atan = math.atan;
var floor = math.floor;
var PI = math.PI;
var separatorRegExp = /(?!^)\s*,?\s*([+-]?\d+\.?\d*|[a-z])/igm; //用','分隔命令和数字，预处理
var replaceRegExp0 = /,?([a-z]),?/gim; //替换命令符两侧的','
var replaceRegExp1 = /([+-]?\d+\.?\d*)\s([+-]?\d+\.?\d*)(?=\s[a-z]|$)/gim; //仅将当前坐标用','分隔
var replaceRegExp2 = /([+-]?\d+\.?\d*)\s([+-]?\d+\.?\d*)\s*(?=[a-z]|$)/gim; //仅将当前坐标用','分隔, 并且在命令符前断行
var fullcommands = {
  M: 'Moveto',
  L: 'Lineto',
  H: 'LinetoHorizontal',
  V: 'LinetoVertical',
  C: 'CurvetoCubic',
  S: 'CurvetoCubicSmooth',
  Q: 'CurvetoQuadratic',
  T: 'CurvetoQuadraticSmooth',
  A: 'Arc'
};
var precision = 1e-6;
var precisionInverse = round(1 / precision);

export function toString(pathOpt) {
  var path = pathOpt.path;

  path = path.replace(separatorRegExp, ',$1');

  switch (pathOpt.opt) {
    case 0:
      path = path.replace(replaceRegExp0, '$1');
      break;
    case 1:
      path = path.replace(/,/g, ' ').replace(replaceRegExp1, '$1,$2');
      break;
    case 2:
      path = path.replace(/,/g, ' ').replace(replaceRegExp2, '$1,$2\n');
      break;
    default:
      path = path.replace(replaceRegExp0, '$1');
      break;
  }
  return path;
}

export function toArray(path, pathElement) {
  if (!path) {
    return ['M', 0, 0];
  }
  if (!pathElement) {
    pathElement = _createPathElement();
    pathElement.setAttribute('d', path);
  }

  var segs = pathElement.pathSegList;
  var seg = {};
  var param = [];
  var result = [];
  var type;
  var lareFlag;
  var sweepFlag;
  var i = 0;

  for (i = 0; i < segs.numberOfItems; i++) {
    seg = segs.getItem(i);
    type = seg.pathSegTypeAsLetter;

    switch (type.toLowerCase()) {
      case 'm':
      case 'l':
      case 't':
        param = [seg.x, seg.y];
        break;
      case 'h':
        param = [seg.x];
        break;
      case 'v':
        param = [seg.y];
        break;
      case 'q':
        param = [seg.x1, seg.y1, seg.x, seg.y];
        break;
      case 's':
        param = [seg.x2, seg.y2, seg.x, seg.y];
        break;
      case 'a':
        lareFlag = seg.largeArcFlag ? 1 : 0;
        sweepFlag = seg.sweepFlag ? 1 : 0;
        param = [seg.r1, seg.r2, seg.angle, lareFlag, sweepFlag, seg.x, seg.y];
        break;
      case 'c':
        param = [seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y];
        break;
      case 'z':
        param = [];
        break;
      default:
        break;
    }
    result.push([type].concat(fix(param)));
  }
  return result;
}
export function toRelative(path) {
  if (!path) return;

  function set(type) {
    var args = [].slice.call(arguments, 1);
    var rcmd = 'createSVGPathSeg' + type + 'Rel';
    var rseg = pathElement[rcmd].apply(pathElement, args);

    segs.replaceItem(rseg, i);
  }

  var pathElement = _createPathElement();
  var segs = {};
  var seg = {};
  var x;
  var y;
  var dx;
  var dy;
  var x0;
  var y0;
  var x1;
  var y1;
  var x2;
  var y2;
  var type;
  var i;

  pathElement.setAttribute('d', path);
  segs = pathElement.pathSegList;

  for (x = 0, y = 0, i = 0; i < segs.numberOfItems; i++) {
    seg = segs.getItem(i);
    type = seg.pathSegTypeAsLetter;

    if (/[MLHVCSQTAZz]/.test(type)) {
      if ('x1' in seg) {
        x1 = seg.x1 - x;
      }
      if ('x2' in seg) {
        x2 = seg.x2 - x;
      }
      if ('y1' in seg) {
        y1 = seg.y1 - y;
      }
      if ('y2' in seg) {
        y2 = seg.y2 - y;
      }
      if ('x' in seg) {
        dx = -x + (x = seg.x);
      }
      if ('y' in seg) {
        dy = -y + (y = seg.y);
      }

      switch (type) {
        case 'M':
          set(fullcommands[type], dx, dy);
          break;
        case 'L':
          set(fullcommands[type], dx, dy);
          break;
        case 'H':
          set(fullcommands[type], dx);
          break;
        case 'V':
          set(fullcommands[type], dy);
          break;
        case 'C':
          set(fullcommands[type], dx, dy, x1, y1, x2, y2);
          break;
        case 'S':
          set(fullcommands[type], dx, dy, x2, y2);
          break;
        case 'Q':
          set(fullcommands[type], dx, dy, x1, y1);
          break;
        case 'T':
          set(fullcommands[type], dx, dy);
          break;
        case 'A':
          set(fullcommands[type], dx, dy, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag);
          break;
        case 'Z':
        case 'z':
          x = x0;
          y = y0;
          break;
      }
    } else {
      if ('x' in seg) x += seg.x;
      if ('y' in seg) y += seg.y;
    }
    // store the start of a subpath
    if (type == 'M' || type == 'm') {
      x0 = x;
      y0 = y;
    }
  }

  return pathElement.getAttribute('d').replace(/Z/g, 'z');
}

export function toAbsolute(path) {
  if (!path) return;

  function set(type) {
    var args = [].slice.call(arguments, 1);
    var rcmd = 'createSVGPathSeg' + type + 'Abs';
    var rseg = pathElement[rcmd].apply(pathElement, args);

    segs.replaceItem(rseg, i);
  }

  var pathElement = _createPathElement();
  var segs = {};
  var seg = {};
  var x;
  var y;
  var dx;
  var dy;
  var x0;
  var y0;
  var x1;
  var y1;
  var x2;
  var y2;
  var type;
  var i;

  pathElement.setAttribute('d', path);
  segs = pathElement.pathSegList;

  for (x = 0, y = 0, i = 0; i < segs.numberOfItems; i++) {
    seg = segs.getItem(i);
    type = seg.pathSegTypeAsLetter;

    if (/[MLHVCSQTA]/.test(type)) {
      if ('x' in seg) x = seg.x;
      if ('y' in seg) y = seg.y;
    } else {
      if ('x1' in seg) x1 = x + seg.x1;
      if ('x2' in seg) x2 = x + seg.x2;
      if ('y1' in seg) y1 = y + seg.y1;
      if ('y2' in seg) y2 = y + seg.y2;
      if ('x' in seg) x += seg.x;
      if ('y' in seg) y += seg.y;

      type = type.toUpperCase();
      switch (type) {
        case 'M':
          set(fullcommands[type], x, y);
          break;
        case 'L':
          set(fullcommands[type], x, y);
          break;
        case 'H':
          set(fullcommands[type], x);
          break;
        case 'V':
          set(fullcommands[type], y);
          break;
        case 'C':
          set(fullcommands[type], x, y, x1, y1, x2, y2);
          break;
        case 'S':
          set(fullcommands[type], x, y, x2, y2);
          break;
        case 'Q':
          set(fullcommands[type], x, y, x1, y1);
          break;
        case 'T':
          set(fullcommands[type], x, y);
          break;
        case 'A':
          set(fullcommands[type], x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag);
          break;
        case 'Z':
          x = x0;
          y = y0;
          break;
      }
    }
    // Record the start of a subpath
    if (type == 'M') {
      x0 = x;
      y0 = y;
    }
  }

  return pathElement.getAttribute('d').replace(/z/g, 'Z');
}

export function nodesPos(path, x, y) {
  // x, y分别为当前路径的起始点坐标
  x = x || 0;
  y = y || 0;

  var pathElement = _createPathElement();
  var segs = {};
  var seg = {};
  var nodesPos = [];
  var isBreakPoint = false;
  var x0;
  var y0;
  var type;
  var i;

  pathElement.setAttribute('d', path);
  segs = pathElement.pathSegList;

  for (i = 0; i < segs.numberOfItems; i++) {
    seg = segs.getItem(i);
    type = seg.pathSegTypeAsLetter;

    isBreakPoint = false;

    if (/[MLHVCSQTA]/.test(type)) {
      if ('x' in seg) x = seg.x;
      if ('y' in seg) y = seg.y;
      if (type === 'M') {
        isBreakPoint = abs(seg.x - x) > precision || abs(seg.y - y) > precision;
        x0 = x;
        y0 = y;
      }
    } else {
      if ('x' in seg) x += seg.x;
      if ('y' in seg) y += seg.y;
      if (type === 'm') {
        isBreakPoint = seg.x !== 0 || seg.y !== 0;
        x0 = x;
        y0 = y;
      }
      if (type == 'z' || type == 'Z') {
        x = x0;
        y = y0;
      }
    }

    nodesPos.push({
      x: x,
      y: y,
      isBreakPoint: isBreakPoint
    });
  }

  return nodesPos;
}
export function length(path, x, y) {
  // x、y为指定路径的起始点，如果有必要的话
  x = x || 0;
  y = y || 0;

  var pathElement = _createPathElement();

  pathElement.setAttribute('d', 'M' + x + ',' + y + path);

  return pathElement.getTotalLength();
}

export function subPathes(path) {
  path = util.toAbsolute(path);

  var nodesPos = util.nodesPos(path);
  var pathArray = util.toArray(path);
  var subs = [];
  var path2 = [];
  var pathData = [];
  var count = 0;
  var sx;
  var sy;
  var x;
  var y;
  var x1;
  var y1;
  var x2;
  var y2;
  var preType;
  var type;
  var type2;
  var len;

  pathArray.forEach(function(item, index) {
    type = item[0];
    pathData = item.slice(1);
    x = nodesPos[index].x;
    y = nodesPos[index].y;

    switch (type) {
      case 'M':
        break;
      case 'L':
      case 'H':
      case 'V':
      case 'Z':
        type2 = 'L';
        pathData = [x, y];
        break;
      case 'A':
        type2 = type;
        break;
      case 'Q':
        type2 = type;
        x1 = pathData[0];
        y1 = pathData[1];
        break;
      case 'T':
        type2 = 'Q';
        if (preType === 'Q' || preType === 'T') {
          x1 = 2 * sx - x1;
          y1 = 2 * sy - y1;
        } else {
          x1 = sx;
          y1 = sy;
        }
        pathData.unshift(x1, y1);
        break;
      case 'C':
        type2 = type;
        x2 = pathData[2];
        y2 = pathData[3];
        break;
      case 'S':
        type2 = 'C';
        if (preType === 'C' || preType === 'S') {
          x1 = 2 * sx - x2;
          y1 = 2 * sy - y2;
        } else {
          x1 = sx;
          y1 = sy;
        }
        x2 = pathData[0];
        y2 = pathData[1];
        pathData.unshift(x1, y1);
        break;
    }

    if (type !== 'M') {
      path2 = ['M', sx, sy, type2].concat(pathData).toString();
      path2 = util.toString({
        path: path2,
        opt: 0
      });
      len = util.length(path2, sx, sy);

      subs.push({
        path: path2,
        type: type,
        normalType: type2,
        index: index,
        count: count++,
        normalPathData: pathData,
        pathData: item.slice(1),
        startPoint: fix([sx, sy]),
        endPoint: fix([x, y]),
        length: len,
        isMoved: preType === 'M'
      });
    }

    sx = x;
    sy = y;
    preType = type;
  });
  return subs;
}

export function lengthes(subPathes) {
  var lens = [];
  var sumLen = 0;

  [].forEach.call(subPathes, function(item, index) {
    sumLen += item.length;
    lens.push(sumLen);
  });

  return lens;
}

export function at(path, position) {
  if (position < 0 || position > totalLength) {
    console.log('position is not in range of the path length');
    return;
  }

  var pathElement = _createPathElement();
  var curPoint = [];
  var frontPoint = [];
  var behindPoint = [];
  var dl = 0.5;
  var totalLength;
  var rotate;
  var tangent;

  pathElement.setAttribute('d', path);
  totalLength = pathElement.getTotalLength();

  curPoint = pathElement.getPointAtLength(position);

  position = max(position - dl, 0);
  frontPoint = pathElement.getPointAtLength(position);
  frontPoint = (dl >= sqrt(pow(frontPoint.x - curPoint.x, 2) + pow(frontPoint.y - curPoint.y, 2))) ? frontPoint : curPoint; // 考虑断点情况

  position = min(position + dl, totalLength);
  behindPoint = pathElement.getPointAtLength(position);
  behindPoint = (dl >= sqrt(pow(behindPoint.x - curPoint.x, 2) + pow(behindPoint.y - curPoint.y, 2))) ? behindPoint : curPoint; // 考虑断点情况

  rotate = (abs(behindPoint.x - frontPoint.x) > precision) ? atan((behindPoint.y - frontPoint.y) / (behindPoint.x - frontPoint.x)) :
    (behindPoint.y > frontPoint.y) ? PI * 0.5 : -PI * 0.5;
  tangent = [cos(rotate), sin(rotate)];

  return {
    point: fix([curPoint.x, curPoint.y]),
    tangent: fix(tangent),
    rotate: fix(rotate)
  };
}

export function cut(path, position) {
  path = util.toAbsolute(path);

  var subPathes = util.subPathes(path);
  var lengthes = util.lengthes(subPathes);
  var curPoint = util.at(path, position).point;
  var curIndex = _binarySearch2(lengthes, position);
  var curSubPath = subPathes[curIndex];
  var pathArray = util.toArray(path);
  var pathData = curSubPath.normalPathData;
  var start = curSubPath.startPoint;
  var end = curSubPath.endPoint;
  var type = curSubPath.normalType;
  var subPath1 = pathArray.slice(0, curSubPath.index);
  var subPath2 = pathArray.slice(curSubPath.index + 1);
  var subs = [];
  var t;

  pathData.unshift(start[0], start[1]);

  if (position > lengthes.slice(-1)[0] || !position) {
    return [pathArray, []];
  }
  if (curIndex > 0) {
    position -= lengthes[curIndex - 1];
  }

  t = position / (subPathes[curIndex].length);

  switch (type) {
    case 'L':
      subs = g.cutLine(pathData, t);
      break;
    case 'A':
      subs = g.cutArc(pathData, curPoint);
      break;
    case 'Q':
    case 'C':
      subs = g.cutBezier(pathData, t);
  }

  subPath1.push([type].concat(subs[0].slice(2)));
  subPath2.unshift(['M'].concat(subs[1].slice(0, 2)), [type].concat(subs[1].slice(2)));

  return [fix(subPath1), fix(subPath2)];
}

export function sub(path, position, length) {
  var subPathes = util.subPathes(path);
  var lengthes = util.lengthes(subPathes);
  var subs = [];
  var path2 = [];

  if (length) {
    subs = util.cut(path, position + length);
    path2 = util.toString({
      path: subs[0].toString(),
      opt: 0
    });
    subs = util.cut(path2, position);
  } else {
    subs = util.cut(path, position);
  }

  return subs[1];
}

export function toNormalized(path) {
  var absPath = util.toAbsolute(path); //先转化为绝对路径
  var subPathes = util.subPathes(absPath);
  var normalPathData = [];
  var curStart = [];
  var pathArray = [];
  var cubic = [];
  var type;
  var i;

  subPathes.forEach(function(subPath, index) {
    normalPathData = subPath.normalPathData;
    type = subPath.normalType;
    curStart = subPath.startPoint;

    if (subPath.isMoved) {
      pathArray.push(['M'].concat(curStart));
    }

    switch (type) {
      case 'L':
      case 'C':
        if (subPath.type === 'Z') {
          pathArray.push(['Z']);
        } else {
          pathArray.push([type].concat(normalPathData));
        }
        break;
      case 'Q':
        normalPathData = g.upgradeBezier(curStart.concat(normalPathData), 3);
        pathArray.push(['C'].concat(normalPathData.slice(2)));
        break;
      case 'A':
        normalPathData = g.arc2curv(curStart.concat(normalPathData));

        for (i = 0; i < normalPathData.length / 6; i++) {
          cubic = normalPathData.slice(i * 6, (i + 1) * 6);
          pathArray.push(['C'].concat(cubic));
        }
        break;
      default:
        console.log('unkown path command');
        break;
    }
  });

  return pathArray;
}

export function toCurve(path) {
  var normalPath = util.toNormalized(path);
  var pathData = [];
  var curStart = [];
  var curEnd = [];
  var cubic = [];
  var type;

  normalPath.forEach(function(sub, i) {
    type = sub[0];
    pathData = fix(sub.slice(1));
    curEnd = pathData.slice(-2);

    if (type === 'L') {
      cubic = g.upgradeBezier(curStart.concat(curEnd), 3);
      normalPath[i] = ['C'].concat(fix(cubic.slice(2)));
    } else {
      normalPath[i] = [type].concat(pathData)
    }
    curStart = curEnd;
  });

  return normalPath;
}

export function transform(path, matrix) {
  var normalPath = util.toNormalized(path);
  var tran = g.transform;
  var end = [];
  var point1 = [];
  var point2 = [];
  var len;
  var type;

  normalPath.forEach(function(sub, i) {
    end = sub.slice(-2);
    len = sub.length;
    type = sub[0];

    switch (type) {
      case 'Z':
        break;
      case 'M':
      case 'L':
        end = tran(matrix, end);
        normalPath[i] = [type].concat(end);
        break;
      case 'C':
        end = tran(matrix, end);

        point1 = sub.slice(1, 3);
        point1 = tran(matrix, point1);

        point2 = sub.slice(3, 5);
        point2 = tran(matrix, point2);

        normalPath[i] = [type].concat(point1, point2, end);
        break;
    }
  });

  return normalPath;
}

export function tween(sourcePath, desPath, t) {
  if (t < 0 || !t) {
    return sourcePath;
  } else if (t >= 1) {
    return desPath;
  }

  var sourcePath2 = util.toCurve(sourcePath);
  var desPath2 = util.toCurve(desPath);
  var sourceSubPathes = util.subPathes(util.toString({
    path: sourcePath2.join(','),
    opt: 0
  }));
  var desSubPathes = util.subPathes(util.toString({
    path: desPath2.join(','),
    opt: 0
  }));
  var sourceSubPath = [];
  var desSubPath = [];
  var n1 = sourceSubPathes.length;
  var n2 = desSubPathes.length;
  var path = '';
  var insertPos = [];
  var insertFillPath = {};
  var insertIndex = 0;
  var i = 0;
  var j = 0;
  var step = 0;
  var value;

  if (n1 > n2) {
    var temp = desSubPathes;

    desSubPathes = sourceSubPathes;
    sourceSubPathes = temp;
    n1 = sourceSubPathes.length;
    n2 = desSubPathes.length;
    t = 1 - t;
  }

  step = n2 > n1 ? floor(n1 / (n2 - n1)) : 0; //插入填充子路径的步距

  while (i < n2 - n1) {
    insertIndex = step * i;
    insertPos = sourceSubPathes[insertIndex].endPoint;
    insertFillPath.startPoint = insertPos;
    insertFillPath.pathData = insertPos.concat(insertPos, insertPos);
    insertFillPath.type = 'C';
    sourceSubPathes.splice(insertIndex + 1, 0, insertFillPath);
    i++;
  }

  for (i = 0; i < n2; i++) {
    var sourceSubPathData = [];
    var desSubPathData = [];
    var tweenSubPathData = [];

    sourceSubPath = sourceSubPathes[i];
    desSubPath = desSubPathes[i];

    if (sourceSubPath.type === 'Z') {
      sourceSubPathData = g.upgradeBezier(sourceSubPath.startPoint.concat(sourceSubPath.endPoint), 3);
    } else {
      sourceSubPathData = sourceSubPath.startPoint.concat(sourceSubPath.pathData);
    }

    if (desSubPath.type === 'Z') {
      desSubPathData = g.upgradeBezier(desSubPath.startPoint.concat(desSubPath.endPoint), 3);
    } else {
      desSubPathData = desSubPath.startPoint.concat(desSubPath.pathData);
    }

    for (j = 0; j < sourceSubPathData.length; j++) {
      value = fix(sourceSubPathData[j] + t * (desSubPathData[j] - sourceSubPathData[j]));
      tweenSubPathData.push(value);
    }

    tweenSubPathData.splice(2, 0, 'C');
    tweenSubPathData.unshift('M');

    path += util.toString({
      path: tweenSubPathData.join(','),
      opt: 0
    });
  }

  return path;
}

export function render(path, svgCanvas) {
  if (svgCanvas) {
    if (svgCanvas.createSVGPathSegMovetoAbs) {
      svgCanvas.setAttribute('d', path);
    } else if (svgCanvas.canvas) {
      var normalPath = util.toNormalized(path);
      var ctx = svgCanvas;
      var pathData = [];
      var type;

      ctx.strokeWidth = 1;
      normalPath.forEach(function(subPath, i) {
        pathData = subPath.slice(1);
        type = subPath[0];

        switch (type) {
          case 'M':
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo.apply(ctx, pathData);
            break;
          case 'L':
            ctx.lineTo.apply(ctx, pathData);
            break;
          case 'C':
            ctx.bezierCurveTo.apply(ctx, pathData);
            break;
          case 'Z':
            ctx.closePath();
            ctx.stroke();
            break;
        }
      });
      ctx.stroke();
    }
  } else {
    alert('Make sure where you want to render to is a canvas 2d context or a svg path element!');
  }
}
const util = {
  toString,
  toArray,
  toRelative,
  toAbsolute,
  nodesPos,
  length,
  subPathes,
  lengthes,
  at,
  cut,
  sub,
  toNormalized,
  toCurve,
  transform,
  tween,
  render
}
export default util
