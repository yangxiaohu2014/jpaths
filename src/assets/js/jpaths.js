/*!
 * ====================================================
 * jpaths - v1.0.0 - 2014-12-02
 * https://github.com/fex-team/jpaths
 * GitHub: https://github.com/fex-team/jpaths.git
 * Copyright (c) 2014 Baidu FEX; Licensed BSD
 * ====================================================
 */

var util = require('./util')
// var shapeDefines = {};
// var jPaths = {};
var separatorRegExp = /(?!^)\s*,?\s*([+-]?\d+\.?\d*|[a-z]+)/igm;//用','分隔命令和数字，预处理
var isCommandRegExp = /^[MLHVCSQTAZ]$/i;//判断自定义path命令是否为svg 原生的path命令
var segCommandRegExp = /[a-z]+(,[+-]?\d+\.?\d*)*/igm; //一段命令，包括命令符和参数

export class Path {
    constructor(...args) {
        this.init(args.length ? args.join(',') : 'M0 0')
    }

    define(name, fn) {
        if (isCommandRegExp.test(name)) throw new Error("The name of the shape you define can't be base command of SVG Path.");

        this.shapeDefines[name] = fn;
    }

    init(path) {
        // if (!arguments.length) throw new Error("The param in the Method set() can't be empty or undefined.");
        this.shapeDefines = {}
        this._ = {};
        this._.path = util.toString({path: path, opt: 0 }); //toDo 添加异常处理
        this._.path1 = util.toString({path: path, opt: 1});
        this._.path2 = util.toString({path: path, opt: 2});
        this._.pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._.pathElement.setAttribute('d', this._.path);
        this._.hasChanged = false;
    }

    append(...args) {
        if (!args.length) return;

        var path = [].slice.call(arguments).toString().replace(separatorRegExp, ',$1');
        var result, path2 = '', type;

        while ((result = segCommandRegExp.exec(path)) !== null) {
            result = result[0].split(',');
            type = result[0];

            if (this.shapeDefines[type]) {
                path2 += this.shapeDefines[type].apply(null, result.slice(1));
            } else {
                path2 += result;
            }
        }
        
        this._.path += util.toString({path: path2, opt: 0});
        this._.path1 += util.toString({path: path2, opt: 1});
        this._.path2 += util.toString({path: path2, opt: 2});
        this._.pathElement.setAttribute('d', this._.path);
        this._.hasChanged = true;
        // 添加异常处理;
    }

    toString(opt) {
        opt = !opt ? '' : opt === '%s' ? 1 : opt === '%n' ? 2 : '';
        return this._['path' + opt]; 
    }

    toArray() {
        return util.toArray(this._.path, this._.pathElement);
    }

    valueOf() {
        return util.toArray(this._.path, this._.pathElement);
    }

    toRelative() {
        return util.toRelative(this._.path);
    }

    toAbsolute() {
        return (this._.absPath = util.toAbsolute(this._.path))
    }

    nodesPos() {
        return (this._.nodesPos = util.nodesPos(this._.path))
    }

    length() {
        return (this._.length = util.length(this._.path))
    }

    lengthes() {
        // 用于获取第一段子路径，前两段子路径，..., 直到所有子路径的长度
        return (this._.lengthes = util.lengthes(this.subPathes()))
    }

    subPathes() {
        return util.subPathes(this._.path)
    }

    at(position) {
        // position是沿着路径从起点出发的距离
        return util.at(this._.path, position);
    }

    cut(position) {
        var subs = util.cut(this._.path, position);

        return [new Path(subs[0]), new Path(subs[1]) ]; 
    }

    sub(position, length) {
        var sub = util.sub(this._.path, position, length);

        return new Path(sub);
    }

    toNormalized() {
        var path = util.toNormalized(this._.path);

        return new Path(path);
    }

    toCurve() {
        var path = util.toCurve(this._.path);

        return new Path(path);
    }

    transform(matrix) {
        var path = util.transform(this._.path, matrix);

        return new Path(path);
    }

    tween(destPath, t) {
        var path = util.tween(this._.path, destPath, t);

        return new Path(path);
    }

    render(svgCanvas) {
        util.render(this._.path, svgCanvas);
    }
}

function jPaths(path) {
    return new Path(path)
    // body...
}

jPaths.version = "0.0.1";
// jPaths.define = Path.prototype.define;
export default jPaths
