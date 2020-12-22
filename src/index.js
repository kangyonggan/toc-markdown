const TocMarkdown = {}

/**
 * 根据markdown内容生成markdown格式的目录
 *
 * @param content
 */
TocMarkdown.generateToc = function (content) {
    let tocList = [];
    let lines = content.split('\n');
    let isCodeLine = false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        // 暂不考虑4空格代码块
        if (line.startsWith('```')) {
            isCodeLine = !isCodeLine;
        }
        // 跳过：代码块、空行、不是#开头的行
        if (isCodeLine || !line || !line.startsWith('#')) {
            continue;
        }
        // 获取标题级别 和 标题名称
        let spaceIndex = line.indexOf(' ');
        tocList.push({
            name: line.substring(spaceIndex).trim(),
            level: spaceIndex
        });
    }
    return toToc(tocList);
}

/**
 * 转为markdown语法的doc
 *
 * @param tocList
 * @returns {string}
 */
function toToc(tocList) {
    let res = '';
    if (tocList.length === 0) {
        return res;
    }
    let minLevel = getMinLevel(tocList);
    for (let i = 0; i < tocList.length; i++) {
        for (let j = 0; j < tocList[i].level - minLevel; j++) {
            res += '  ';
        }
        let name = tocList[i].name;
        let repeat = getRepeatName(name, tocList, i);
        name = name.replace('. ', '-');
        if (repeat > 0) {
            res += '- [' + tocList[i].name + '](#' + name + '-' + repeat + ')\n';
        } else {
            res += '- [' + tocList[i].name + '](#' + name + ')\n';
        }
    }
    return  res;
}

/**
 * 获取name的重复次数
 *
 * @param name
 * @param tocList
 * @param endIndex
 * @returns {number}
 */
function getRepeatName(name, tocList, endIndex) {
    let count = 0;
    for (let i = 0; i < endIndex; i++) {
        if (tocList[i].name === name) {
            count++;
        }
    }
    return count;
}

/**
 * 判断最小的是几级标题
 *
 * @param tocList
 * @returns {number}
 */
function getMinLevel(tocList) {
    let minLevel = 999;
    for (let i = 0; i < tocList.length; i++) {
        if (tocList[i].level < minLevel) {
            minLevel = tocList[i].level;
        }
    }

    return minLevel;
}

export default TocMarkdown