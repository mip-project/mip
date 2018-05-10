<script>
export default {
    name: 'mip-appshell-loading',
    props: {
        indeterminate: Boolean,

        rotate: {
            type: Number,
            default: 0
        },

        size: {
            type: [Number, String],
            default: 32
        },

        width: {
            type: Number,
            default: 4
        },

        value: {
            type: Number,
            default: 0
        }
    },

    computed: {
        calculatedSize () {
            return Number(this.size)
        },

        circumference () {
            return 2 * Math.PI * this.radius
        },

        classes () {
            return {
                'mip-loading': true,
                'mip-loading--indeterminate': this.indeterminate
            };
        },

        normalizedValue () {
            if (this.value < 0) {
                return 0
            }

            if (this.value > 100) {
                return 100
            }

            return this.value
        },

        radius () {
            return 20
        },

        strokeDashArray () {
            return Math.round(this.circumference * 1000) / 1000
        },

        strokeDashOffset () {
            return ((100 - this.normalizedValue) / 100) * this.circumference + 'px'
        },

        strokeWidth () {
            return this.width / this.size * this.viewBoxSize * 2
        },

        styles () {
            return {
                height: `${this.calculatedSize}px`,
                width: `${this.calculatedSize}px`
            }
        },

        svgStyles () {
            return {
                transform: `rotate(${this.rotate}deg)`
            }
        },

        viewBoxSize () {
            return this.radius / (1 - this.width / this.size)
        }
    },

    methods: {
        genCircle (h, name, offset) {
            return h('circle', {
                class: `mip-loading-${name}`,
                attrs: {
                    fill: 'transparent',
                    cx: 2 * this.viewBoxSize,
                    cy: 2 * this.viewBoxSize,
                    r: this.radius,
                    'stroke-width': this.strokeWidth,
                    'stroke-dasharray': this.strokeDashArray,
                    'stroke-dashoffset': offset
                }
            })
        },
        genSvg (h) {
            const children = [
                this.indeterminate || this.genCircle(h, 'underlay', 0),
                this.genCircle(h, 'overlay', this.strokeDashOffset)
            ]

            return h('svg', {
                style: this.svgStyles,
                attrs: {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: `${this.viewBoxSize} ${this.viewBoxSize} ${2 * this.viewBoxSize} ${2 * this.viewBoxSize}`
                }
            }, children)
        }
    },

    render (h) {
        const info = h('div', { class: 'v-progress-circular__info' }, [this.$slots.default])
        const svg = this.genSvg(h)

        return h('div', {
            class: this.classes,
            style: this.styles,
            on: this.$listeners
        }, [svg, info])
    }
}
</script>

<style lang="less">
@loading-color: #1867c0;
@progress-circular-rotate-animation: progress-circular-rotate 1.4s linear infinite;
@progress-circular-rotate-dash: progress-circular-dash 1.4s ease-in-out infinite;
@progress-circular-overlay-transition: all .6s ease-in-out;
@progress-circular-intermediate-svg-transition: all .2s ease-in-out;

.mip-loading {
    position: relative;
    display: inline-flex;
    color: @loading-color;

    svg {
        width: 100%;
        height: 100%;
        margin: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 0;
    }

    &--indeterminate {
        svg {
            animation: @progress-circular-rotate-animation;
            transform-origin: center center;
            transition: @progress-circular-intermediate-svg-transition;
        }

        .mip-loading-overlay {
            animation: @progress-circular-rotate-dash;
            stroke-linecap: round;
            stroke-dasharray: 80,200;
            stroke-dashoffset: 0px;
        }
    }

    &-overlay {
        stroke: currentColor;
        z-index: 2;
        transition: @progress-circular-overlay-transition;
    }
}

@keyframes progress-circular-dash {
    0% {
        stroke-dasharray: 1,200;
        stroke-dashoffset: 0px;
    }

    50% {
        stroke-dasharray: 100,200;
        stroke-dashoffset: -15px;
    }

    100% {
        stroke-dasharray: 100,200;
        stroke-dashoffset: -125px;
    }
}

@keyframes progress-circular-rotate {
    100% {
        transform: rotate(360deg);
    }
}
</style>
