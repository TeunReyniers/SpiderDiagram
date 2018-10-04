const RenderCanvas = {
    formatText: function (text) {
        if (studentsText.substr(0, 1) == '"') {
            return text.substr(1, text.length)
        }
        return text
    },

    download: function () {
        filename = selectedLeerling
        var canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        canvas.toBlob(function (blob) {
            saveAs(blob, filename + ".png");
        });
    },

    downloadAll: function () {
        var zip = new JSZip();
        const selector = document.getElementById("studentSelector")

        selector.selectedIndex = 0
        selectedStudentChanged()

        for (let q = 0; q < selector.length; q++) {

            filename = selectedLeerling
            const canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");

            var savable = new Image();
            savable.src = canvas.toDataURL();
            zip.file(filename + ".png", savable.src.substr(savable.src.indexOf(',') + 1), { base64: true });

            nextStudent()
        }

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, "example.zip");
            });

    },


    drawCanvas: function (data) {

        const scale = data.format.canvas_size.width / 200;
        const lineScale = scale / 3
        const center = data.format.diagram.position && ScalePoint(scale, data.format.diagram.position) || { X: data.format.canvas_size.width / 2, Y: data.format.canvas_size.height / 2 }
        const partCount = data.layout.sectors.reduce((c, s) => c + s.parts.length, 0)
        const diagram = data.format.diagram

        let canvas = document.getElementById("canvas");


        canvas.setAttribute('width', data.format.canvas_size.width);
        canvas.setAttribute('height', data.format.canvas_size.height);
        var ctx = canvas.getContext("2d");

        //Title
        DrawTextSmart(ctx, data.layout.title, data.format.title, scale, data.format.title.color)

        //student
        const studentIndex = data.items.findIndex(s => s.name == selectedLeerling)
        const student = data.items[studentIndex]
        console.log(student);

        DrawTextSmart(ctx, student.name, data.format.student, scale, data.format.student.color)

        //pie parts 
        let index = 0
        student.scores.forEach(score => {
            if (data.options.colorfill == "piece") {
                const grade = data.layout.grades[score]
                DrawPiePartPartArea(ctx, 0, grade.width * scale * diagram.radius / 10,
                    center, index * 360 / partCount, (index + 1) * 360 / partCount, grade.color)

            } else {
                let previousRadius = 0
                console.log(score);
                for (let si = 0; si <= score; si++) {
                    let grade = data.layout.grades[si]
                    DrawPiePartPartArea(ctx, previousRadius * scale * diagram.radius / 10,
                        grade.width * scale * diagram.radius / 10, center,
                        index * 360 / partCount, (index + 1) * 360 / partCount, grade.color)
                    previousRadius = grade.width
                }
            }
            index++
        })


        //circles
        previousRadius = 0
        data.layout.grades.forEach(grade => {
            DrawCircle(ctx, grade.width * scale * diagram.radius / 10,
                center, diagram.lines.circles.color, diagram.lines.circles.width * lineScale)
            DrawText(ctx, grade.name,
                {
                    X: center.X + diagram.text.circles.offset.X,
                    Y: center.Y - (previousRadius * diagram.radius / 10 - diagram.text.circles.offset.Y) * scale
                },
                GetFontStyle(scale, diagram.text.circles.font),
                diagram.text.circles.alignment,
                diagram.text.circles.rotation,
                diagram.text.circles.color
            )

            previousRadius = grade.width
        });


        //part lines
        let partNumber = 0
        data.layout.sectors.forEach(sector => {
            const angle = partNumber * 360 / partCount + sector.parts.length * 180 / partCount
            const sectorLabelPosition = {
                X: center.X + Math.cos(GetRadians(angle)) * diagram.text.sector.radius * diagram.radius / 10 * scale,
                Y: center.Y + Math.sin(GetRadians(angle)) * diagram.text.sector.radius * diagram.radius / 10 * scale,
            }
            const textangle = GetSmartRotateAngle(diagram.text.sector, sectorLabelPosition, center, angle, diagram.text.sector.smartRotateInvert)
            //sector text
            if (diagram.text.sector.bow) {
                DrawTextOnArc(ctx, diagram.text.sector.radius * diagram.radius / 10 * scale,
                    center, angle, sector.name, diagram.text.sector, scale, GetSmartRotateFlip(diagram.text.sector, sectorLabelPosition, center, diagram.text.sector.smartRotateInvert))
            } else {
                DrawText(ctx, sector.name, sectorLabelPosition,
                    GetFontStyle(scale, diagram.text.sector.font),
                    diagram.text.sector.alignment,
                    textangle,
                    diagram.text.sector.color)
            }
            let first = true
            sector.parts.forEach(part => {
                const angle = partNumber++ * 360 / partCount
                if (!first) DrawLine(ctx, angle,
                    diagram.lines.part.length * diagram.radius / 10 * scale,
                    center, diagram.lines.part.color, diagram.lines.part.width * lineScale)
                const partLabelPosition = {
                    X: center.X + Math.cos(GetRadians(angle + 180 / partCount)) * diagram.text.part.radius * diagram.radius / 10 * scale,
                    Y: center.Y + Math.sin(GetRadians(angle + 180 / partCount)) * diagram.text.part.radius * diagram.radius / 10 * scale,
                }
                //part text
                if (diagram.text.part.bow) {
                    DrawTextOnArc(ctx, diagram.text.part.radius * diagram.radius / 10 * scale,
                        center, angle + 180 / partCount, part.name, diagram.text.part, scale, GetSmartRotateFlip(diagram.text.part, partLabelPosition, center, diagram.text.part.smartRotateInvert))
                } else {
                    DrawText(ctx, part.name,
                        partLabelPosition,
                        GetFontStyle(scale, diagram.text.part.font),
                        diagram.text.part.alignment,
                        GetSmartRotateAngle(diagram.text.part, partLabelPosition, center, angle + 180 / partCount, diagram.text.part.smartRotateInvert),
                        diagram.text.part.color)
                }
                first = false
            })
        })

        //sector lines
        partNumber = 0
        data.layout.sectors.forEach(sector => {
            const angle = partNumber * 360 / partCount
            DrawLine(ctx, angle, diagram.lines.sector.length * diagram.radius / 10 * scale,
                center, diagram.lines.sector.color, diagram.lines.sector.width * lineScale)
            partNumber += sector.parts.length
        })


        //circles text
        previousRadius = 0
        data.layout.grades.forEach(grade => {
            DrawText(ctx, grade.name,
                {
                    X: center.X + diagram.text.circles.offset.X,
                    Y: center.Y - (previousRadius * diagram.radius / 10 - diagram.text.circles.offset.Y) * scale
                },
                GetFontStyle(scale, diagram.text.circles.font),
                diagram.text.circles.alignment,
                diagram.text.circles.rotation,
                diagram.text.circles.color
            )

            previousRadius = grade.width
        });
    },

    DrawLine: function (ctx, angle, length, start, color = 'black', width = 1) {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.moveTo(start.X, start.Y)
        ctx.lineTo(start.X + Math.cos(GetRadians(angle)) * length, start.Y + Math.sin(GetRadians(angle)) * length)
        ctx.stroke()
        ctx.restore()
    },

    DrawCircle: function (ctx, radius, center, color = 'black', width = 1) {
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.arc(center.X, center.Y, radius, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.restore()
    },

    DrawText: function (ctx, text, position, fontStyle = '20px Arial', alignment = 'center', rotation = 0, color) {
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
    },

    DrawTextSmart: function DrawTextSmart(ctx, text, textStyle, scale, color) {
        DrawText(ctx, text, ScalePoint(scale, textStyle.position), GetFontStyle(scale, textStyle.font || { type: 'Arial', size: 5, style: '' }), textStyle.alignment || 'center', textStyle.rotation || 0, color)
    },

    DrawTextSmart2: function (ctx, text, textStyle, scale, defaultPosition) {
        DrawText(ctx, text, ScalePoint(scale, textStyle ? textStyle.position || defaultPosition : defaultPosition), GetFontStyle(scale, textStyle ? textStyle.font || { type: 'Arial', size: 5, style: '' } : { type: 'Arial', size: 5, style: '' }), textStyle ? textStyle.alignment || 'center' : 'center', textStyle ? textStyle.rotation || 0 : 0)
    },

    DrawTextOnArc: function (ctx, radius, center, middleAngle, text, textstyle, scale, flip) {
        ctx.save()
        ctx.font = GetFontStyle(scale, textstyle.font)
        ctx.textAlign = textstyle.alignment
        ctx.textBaseline = 'middle'
        ctx.fillStyle = textstyle.color

        const fullTextWidth = ctx.measureText(text).width
        const totalAngle = fullTextWidth / radius
        const startAngle = flip ? GetRadians(middleAngle) + totalAngle / 2 : GetRadians(middleAngle) - totalAngle / 2
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
    },

    DrawPiePartArea: function (ctx, radius, center, startAngle = 0, endAngle = 2 * Math.PI, color = '#999') {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 0
        ctx.fillStyle = color
        ctx.arc(center.X, center.Y, radius, GetRadians(startAngle), GetRadians(endAngle))
        ctx.moveTo(center.X, center.Y)
        ctx.lineTo(center.X + Math.cos(GetRadians(startAngle)) * radius, center.Y + Math.sin(GetRadians(startAngle)) * radius)
        ctx.lineTo(center.X + Math.cos(GetRadians(endAngle)) * radius, center.Y + Math.sin(GetRadians(endAngle)) * radius)
        ctx.lineTo(center.X, center.Y)
        ctx.fill()
        ctx.restore()
    },

    DrawPiePartPartArea: function (ctx, innerRadius, outerRadius, center, startAngle, endAngle, color = "#999") {
        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 0
        ctx.fillStyle = color
        ctx.arc(center.X, center.Y, innerRadius, GetRadians(startAngle), GetRadians(endAngle))
        ctx.arc(center.X, center.Y, outerRadius, GetRadians(endAngle), GetRadians(startAngle), true)
        ctx.fill()
        ctx.restore()
    },

    GetRadians: function (degrees) {
        return degrees / 180 * Math.PI - Math.PI / 2
    },

    GetFontStyle: function (scale, font) {
        return font.style + ' ' + font.size * scale + 'px ' + font.type
    },

    ScalePoint: function (scale, point) {
        return {
            X: point.X * scale,
            Y: point.Y * scale
        }
    },

    GetSmartRotateAngle: function (text, position, center, angle, invert) {
        const offset = { X: position.X - center.X, Y: position.Y - center.Y }

        if (!text.smartRotate) return angle + text.rotation

        if (text.smartRotateDirection == 'vertical') {
            if (offset.Y > 0) return angle + text.rotation + (invert ? 0 : 180)
        } else {
            if (offset.X > 0) return angle + text.rotation + (invert ? 0 : 180)
        }
        return angle + text.rotation + (invert ? 180 : 0)

    },

    GetSmartRotateFlipSingle: function (text, position, center) {
        const offset = { X: position.X - center.X, Y: position.Y - center.Y }

        if (!text.smartRotate) return false

        if (text.smartRotateDirection == 'vertical') {
            if (offset.Y > 0) return true
        } else {
            if (offset.X > 0) return true
        }
        return false

    },

    GetSmartRotateFlip: function (text, position, center, invert) {
        if (!text.smartRotate) return false
        return invert ? !GetSmartRotateFlipSingle(text, position, center) : GetSmartRotateFlipSingle(text, position, center)
    }
}