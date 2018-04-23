import React from 'react';
import PropTypes from 'prop-types';

// Use CSS text-overflow if only one line of text

const propTypes = {
    text: PropTypes.string.isRequired,
    textEllipsis: PropTypes.shape({
        lines: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        font: PropTypes.string,
        letterSpacing: PropTypes.number
    })
};

const defaultProps = {
    font: '300 14px CNNSans',
    letterSpacing: 0.2
}

const getTextWidth = (text, font, letterSpacing) => {
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return Math.ceil(metrics.width + (letterSpacing * text.length));
}

const countLines = (text, lines, width, font, letterSpacing) => {
    const textArray = text.split(' ');
    const textCache = []; // cache deconstructed text lines to reduce to one for-loop and reduce getTextWidth calls
    let compareText = '';
    let lineCount = 0;
    for (let i = 0; i < textArray.length; i += 1) {
        if (getTextWidth(compareText + textArray[i] + ' ', font, letterSpacing) >= width) {
            lineCount += 1;
            if (lineCount === lines) {
                compareText = compareText.trim();
                if (getTextWidth(compareText + '...', font, letterSpacing) >= width) {
                    // if adding ellipsis pushes to new line, remove last word
                    compareText = compareText.slice(0, compareText.lastIndexOf(' '));
                }
                compareText += '...';
                textCache.push(compareText);
                compareText = textArray[i] + ' ';
                break;
            } else {
                textCache.push(compareText);
                compareText = textArray[i] + ' ';
            }
        } else {
            compareText += textArray[i] + ' ';
        }
    }

    if (compareText.length > 1) {
        lineCount += 1;
    }

    return { lineCount, textCache };
}

const TextEllipsis = ({ text, textEllipsis: { lines, width, font, letterSpacing } }) => {
    const textCheck = countLines(text, lines, width, font, letterSpacing);
    if (textCheck.lineCount > lines) {
        const startText = textCheck.textCache.slice(0, lines - 1).join(' ');
        const textEllipsis = textCheck.textCache.slice(lines - 1, lines);
        return (
            <div>
                {startText}
                <br />
                {textEllipsis}
            </div>
        );
    } else {
        return text;
    }
};

TextEllipsis.propTypes = propTypes;
TextEllipsis.defaultProps = defaultProps;

export default TextEllipsis;