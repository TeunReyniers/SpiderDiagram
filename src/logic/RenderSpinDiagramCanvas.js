import { Students } from "../components/Students";

export class RenderCanvas {

    static formatText(text) {
        if (text.substr(0, 1) === '"') {
            return text.substr(1, text.length)
        }
        return text
    }


    static drawCanvas(data, canvasId, student, width) {

        data.style.grades = data.style.grades || [
            { name: "Onvoldoende", width: 3, color: '#3b8686' },
            { name: "Voldoende", width: 6, color: '#79bd9a' },
            { name: "Goed", width: 9, color: '#a8dba8' },
            { name: "Stoppen met werken", width: 10, color: '#cff09e' },
        ]

        const scale = width / 200;
        const lineScale = scale / 3
        const center = data.style.diagram.position && this.ScalePoint(scale, data.style.diagram.position) || { X: data.style.canvas_size.width / 2, Y: data.style.canvas_size.height / 2 }
        const partCount = data.type.sectors.reduce((c, s) => c + s.parts.length, 0)
        const diagram = data.style.diagram

        let canvas = document.getElementById(canvasId);

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', width * data.style.ratio);
        //canvas.width = width;
        //canvas.height = width * data.style.ratio;
        //canvas.style.width = width / window.devicePixelRatio + "px";
        //canvas.style.height = width * data.style.ratio / window.devicePixelRatio + "px";
        var ctx = canvas.getContext("2d");
        //ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        if (student === undefined || student === 'false' || student.scores === undefined) {
            this.DrawText(ctx, 'No student selected', center,  '20px Arial',  'center',  0, 'black')
            return
        }

        //Title
        this.DrawTextSmart(ctx, data.type.title, data.style.title, scale, data.style.title.color)
        this.DrawTextSmart(ctx, student.name, data.style.student, scale, data.style.student.color)

        

        //pie parts 
        let index = 0
        student.scores.forEach(score => {
            if (data.style.fillmode === "piece") {
                const grade = data.style.grades[Math.min(score, data.style.grades.length - 1)]
                this.DrawPiePartPartArea(ctx, 0, grade.width * scale * diagram.radius / 10,
                    center, index * 360 / partCount, (index + 1) * 360 / partCount, grade.color)

            } else {
                let previousRadius = 0
                for (let si = 0; si <= score; si++) {
                    let grade = data.style.grades[Math.min(si, data.style.grades.length - 1)]
                    this.DrawPiePartPartArea(ctx, previousRadius * scale * diagram.radius / 10,
                        grade.width * scale * diagram.radius / 10, center,
                        index * 360 / partCount, (index + 1) * 360 / partCount, grade.color)
                    previousRadius = grade.width
                }
            }
            index++
        })


        //circles
        let previousRadius = 0
        data.style.grades.forEach(grade => {
            this.DrawCircle(ctx, grade.width * scale * diagram.radius / 10,
                center, diagram.lines.circles.color, diagram.lines.circles.width * lineScale)
            this.DrawText(ctx, grade.name,
                {
                    X: center.X + diagram.text.circles.offset.X,
                    Y: center.Y - (previousRadius * diagram.radius / 10 - diagram.text.circles.offset.Y) * scale
                },
                this.GetFontStyle(scale, diagram.text.circles.font),
                diagram.text.circles.alignment,
                diagram.text.circles.rotation,
                diagram.text.circles.color
            )

            previousRadius = grade.width
        });


        //part lines
        let partNumber = 0
        data.type.sectors.forEach(sector => {
            const angle = partNumber * 360 / partCount + sector.parts.length * 180 / partCount
            const sectorLabelPosition = {
                X: center.X + Math.cos(this.GetRadians(angle)) * diagram.text.sector.radius * diagram.radius / 10 * scale,
                Y: center.Y + Math.sin(this.GetRadians(angle)) * diagram.text.sector.radius * diagram.radius / 10 * scale,
            }
            const textangle = this.GetSmartRotateAngle(diagram.text.sector, sectorLabelPosition, center, angle, diagram.text.sector.smartRotateInvert)
            //sector text
            if (diagram.text.sector.bow) {
                this.DrawTextOnArc(ctx, diagram.text.sector.radius * diagram.radius / 10 * scale,
                    center, angle, sector.name, diagram.text.sector, scale, this.GetSmartRotateFlip(diagram.text.sector, sectorLabelPosition, center, diagram.text.sector.smartRotateInvert))
            } else {
                this.DrawText(ctx, sector.name, sectorLabelPosition,
                    this.GetFontStyle(scale, diagram.text.sector.font),
                    diagram.text.sector.alignment,
                    textangle,
                    diagram.text.sector.color)
            }
            let first = true
            sector.parts.forEach(part => {
                const angle = partNumber++ * 360 / partCount
                if (!first) this.DrawLine(ctx, angle,
                    diagram.lines.part.length * diagram.radius / 10 * scale,
                    center, diagram.lines.part.color, diagram.lines.part.width * lineScale)
                const partLabelPosition = {
                    X: center.X + Math.cos(this.GetRadians(angle + 180 / partCount)) * diagram.text.part.radius * diagram.radius / 10 * scale,
                    Y: center.Y + Math.sin(this.GetRadians(angle + 180 / partCount)) * diagram.text.part.radius * diagram.radius / 10 * scale,
                }
                //part text
                if (diagram.text.part.bow) {
                    this.DrawTextOnArc(ctx, diagram.text.part.radius * diagram.radius / 10 * scale,
                        center, angle + 180 / partCount, part.name, diagram.text.part, scale, this.GetSmartRotateFlip(diagram.text.part, partLabelPosition, center, diagram.text.part.smartRotateInvert))
                } else {
                    this.DrawText(ctx, part.name,
                        partLabelPosition,
                        this.GetFontStyle(scale, diagram.text.part.font),
                        diagram.text.part.alignment,
                        this.GetSmartRotateAngle(diagram.text.part, partLabelPosition, center, angle + 180 / partCount, diagram.text.part.smartRotateInvert),
                        diagram.text.part.color)
                }
                first = false
            })
        })

        //sector lines
        partNumber = 0
        data.type.sectors.forEach(sector => {
            const angle = partNumber * 360 / partCount
            this.DrawLine(ctx, angle, diagram.lines.sector.length * diagram.radius / 10 * scale,
                center, diagram.lines.sector.color, diagram.lines.sector.width * lineScale)
            partNumber += sector.parts.length
        })


        //circles text
        previousRadius = 0
        data.style.grades.forEach(grade => {
            this.DrawText(ctx, grade.name,
                {
                    X: center.X + diagram.text.circles.offset.X,
                    Y: center.Y - (previousRadius * diagram.radius / 10 - diagram.text.circles.offset.Y) * scale
                },
                this.GetFontStyle(scale, diagram.text.circles.font),
                diagram.text.circles.alignment,
                diagram.text.circles.rotation,
                diagram.text.circles.color
            )

            previousRadius = grade.width
        });
    }

    static DrawLine(ctx, angle, length, start, color = 'black', width = 1) {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.moveTo(start.X, start.Y)
        ctx.lineTo(start.X + Math.cos(this.GetRadians(angle)) * length, start.Y + Math.sin(this.GetRadians(angle)) * length)
        ctx.stroke()
        ctx.restore()
    }

    static DrawCircle(ctx, radius, center, color = 'black', width = 1) {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.arc(center.X, center.Y, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.restore()
    }

    static DrawText(ctx, text, position, fontStyle = '20px Arial', alignment = 'center', rotation = 0, color) {
        ctx.save()
        ctx.font = fontStyle
        ctx.textAlign = alignment
        ctx.textBaseline = 'middle'
        ctx.fillStyle = color
        ctx.translate(position.X, position.Y)
        ctx.rotate(Math.PI * rotation / 180)
        ctx.translate(-position.X, -position.Y)
        ctx.fillText(text, position.X, position.Y)
        ctx.restore()
    }

    static DrawTextSmart(ctx, text, textStyle, scale, color) {
        this.DrawText(ctx, text, this.ScalePoint(scale, textStyle.position), this.GetFontStyle(scale, textStyle.font || { type: 'Arial', size: 5, style: '' }), textStyle.alignment || 'center', textStyle.rotation || 0, color)
    }

    static DrawTextSmart2(ctx, text, textStyle, scale, defaultPosition) {
        this.DrawText(ctx, text, this.ScalePoint(scale, textStyle ? textStyle.position || defaultPosition : defaultPosition), this.GetFontStyle(scale, textStyle ? textStyle.font || { type: 'Arial', size: 5, style: '' } : { type: 'Arial', size: 5, style: '' }), textStyle ? textStyle.alignment || 'center' : 'center', textStyle ? textStyle.rotation || 0 : 0)
    }

    static DrawTextOnArc(ctx, radius, center, middleAngle, text, textstyle, scale, flip) {
        ctx.save()
        ctx.font = this.GetFontStyle(scale, textstyle.font)
        ctx.textAlign = textstyle.alignment
        ctx.textBaseline = 'middle'
        ctx.fillStyle = textstyle.color

        const fullTextWidth = ctx.measureText(text).width
        const totalAngle = fullTextWidth / radius
        const startAngle = flip ? this.GetRadians(middleAngle) + totalAngle / 2 : this.GetRadians(middleAngle) - totalAngle / 2
        ctx.translate(center.X, center.Y)
        ctx.rotate(startAngle)
        ctx.translate(-center.X, -center.Y)
        text.split('').forEach(c => {
            const angle = ctx.measureText(c).width / fullTextWidth * totalAngle
            const labelPosition = {
                X: center.X + Math.cos(0) * radius,
                Y: center.Y + Math.sin(0) * radius,
            }

            ctx.translate(labelPosition.X, labelPosition.Y)
            ctx.rotate(flip ? -Math.PI / 2 : Math.PI / 2)
            ctx.fillText(c, 0, 0)
            ctx.rotate(flip ? Math.PI / 2 : -Math.PI / 2)
            ctx.translate(-labelPosition.X, -labelPosition.Y)

            ctx.translate(center.X, center.Y)
            ctx.rotate(flip ? -angle : angle)
            ctx.translate(-center.X, -center.Y)
        })
        ctx.restore()
    }

    static DrawPiePartArea(ctx, radius, center, startAngle = 0, endAngle = 2 * Math.PI, color = '#999') {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 0
        ctx.fillStyle = color
        ctx.arc(center.X, center.Y, radius, this.GetRadians(startAngle), this.GetRadians(endAngle))
        ctx.moveTo(center.X, center.Y)
        ctx.lineTo(center.X + Math.cos(this.GetRadians(startAngle)) * radius, center.Y + Math.sin(this.GetRadians(startAngle)) * radius)
        ctx.lineTo(center.X + Math.cos(this.GetRadians(endAngle)) * radius, center.Y + Math.sin(this.GetRadians(endAngle)) * radius)
        ctx.lineTo(center.X, center.Y)
        ctx.fill()
        ctx.restore()
    }

    static DrawPiePartPartArea(ctx, innerRadius, outerRadius, center, startAngle, endAngle, color = "#999") {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 0
        ctx.fillStyle = color
        ctx.arc(center.X, center.Y, innerRadius, this.GetRadians(startAngle), this.GetRadians(endAngle))
        ctx.arc(center.X, center.Y, outerRadius, this.GetRadians(endAngle), this.GetRadians(startAngle), true)
        ctx.fill()
        ctx.restore()
    }

    static GetRadians(degrees) {
        return degrees / 180 * Math.PI - Math.PI / 2
    }

    static GetFontStyle(scale, font) {
        return font.style + ' ' + font.size * scale + 'px ' + font.type
    }

    static ScalePoint(scale, point) {
        return {
            X: point.X * scale,
            Y: point.Y * scale
        }
    }

    static GetSmartRotateAngle(text, position, center, angle, invert) {
        const offset = { X: position.X - center.X, Y: position.Y - center.Y }

        if (!text.smartRotate) return angle + text.rotation

        if (text.smartRotateDirection === 'vertical') {
            if (offset.Y > 0) return angle + text.rotation + (invert ? 0 : 180)
        } else {
            if (offset.X > 0) return angle + text.rotation + (invert ? 0 : 180)
        }
        return angle + text.rotation + (invert ? 180 : 0)

    }

    static GetSmartRotateFlipSingle(text, position, center) {
        const offset = { X: position.X - center.X, Y: position.Y - center.Y }

        if (!text.smartRotate) return false

        if (text.smartRotateDirection === 'vertical') {
            if (offset.Y > 0) return true
        } else {
            if (offset.X > 0) return true
        }
        return false

    }

    static GetSmartRotateFlip(text, position, center, invert) {
        if (!text.smartRotate) return false
        return invert ? !this.GetSmartRotateFlipSingle(text, position, center) : this.GetSmartRotateFlipSingle(text, position, center)
    }
}