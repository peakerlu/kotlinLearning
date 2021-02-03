package com.example.kotlindemo.view

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.util.Log
import android.view.View

class ChatView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {
    private val TAG = "ChatView"
    var xyPaint = Paint()
    var xyTextPaint = Paint()
    var linePaint = Paint()
    private var xylinewidth = dpToPx(1)
    private var viewWidth // 当前控件的宽度
            = 0
    private var viewHeight // 当前控件的高度
            = 0

    init {

        initPaint()
    }

    //初始化画笔
    private fun initPaint() {
        //xy轴线画笔
        //反锯齿
        xyPaint.isAntiAlias = true
        //线宽
        xyPaint.strokeWidth = xylinewidth.toFloat()
        //画笔线帽样式
        /**
         * Paint.Cap.BUTT：无
        Paint.Cap.SQUARE：方形
        Paint.Cap.ROUND： 半圆形
         */
        xyPaint.strokeCap = Paint.Cap.ROUND
        xyPaint.color = Color.BLACK
//文字画笔

        xyTextPaint.isAntiAlias = true
        xyTextPaint.textSize = spToPx(10).toFloat()
        xyTextPaint.strokeCap = Paint.Cap.ROUND
        xyTextPaint.color = Color.BLACK
        //        xyTextPaint.setStyle(Paint.Style.STROKE);
        //折线的画笔
        linePaint.isAntiAlias = true
        linePaint.strokeWidth = dpToPx(1).toFloat()
        linePaint.strokeCap = Paint.Cap.ROUND
        linePaint.color = Color.BLUE
        linePaint.style = Paint.Style.STROKE
    }

    /**
     * dp转化成为px
     *
     * @param dp
     * @return
     */
    private fun dpToPx(dp: Int): Int {
        val density = context.resources.displayMetrics.density
        return (dp * density + 0.5f * if (dp >= 0) 1 else -1).toInt()
    }

    /**
     * sp转化为px
     *
     * @param sp
     * @return
     */
    private fun spToPx(sp: Int): Int {
        val scaledDensity = context.resources.displayMetrics.scaledDensity
        return (scaledDensity * sp + 0.5f * if (sp >= 0) 1 else -1).toInt()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawLine(
            dpToPx(35).toFloat(),
            dpToPx(35).toFloat(),
            dpToPx(35).toFloat(),
            viewHeight -   dpToPx(35).toFloat(),
            xyPaint
        )

    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)

        // MeasureSpec.EXACTLY 精确模式，指定大小，例如：200dp
        // MeasureSpec.AT_MOST 最大模式，由父控件控制最大，子控件不能比父控件大，当然可以比父控件小
        if (MeasureSpec.getMode(heightMeasureSpec) == MeasureSpec.EXACTLY) {
            viewHeight = MeasureSpec.getSize(heightMeasureSpec)
        } else require(MeasureSpec.getMode(heightMeasureSpec) != MeasureSpec.AT_MOST) {
            "高度指定参数异常，请按照，例如：200dp"
        }
        viewWidth = MeasureSpec.getSize(widthMeasureSpec)

        // 这两个值是根据手机屏幕而变化的
        Log.d(TAG, "viewHeight:$viewHeight viewWidth:$viewWidth")
        setMeasuredDimension(viewWidth, viewHeight)


    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)

    }

}