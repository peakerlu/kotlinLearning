package com.example.kotlindemo

import android.annotation.SuppressLint
import android.os.Bundle
import android.transition.Slide
import android.transition.TransitionManager
import android.util.Log
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.kotlindemo.utils.SPUtils
import kotlinx.android.synthetic.main.activity_transition.*

private const val TAG = "TransitionActivity"

class TransitionActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_transition)

        initTransition()
    }

    @SuppressLint("NewApi")
    private fun initTransition() {

        btn.setOnClickListener {
            val slide = Slide()
            slide.interpolator = AccelerateDecelerateInterpolator()
            TransitionManager.beginDelayedTransition(root, slide)
            Toast.makeText(this, "ss", Toast.LENGTH_SHORT).show()
            toggleViewVisible(tv_view)
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)

        val appAttachTime: Long = SPUtils.getSPInstance(this).getSP().getLong(
            "application_attach_time",
            0
        )
        val diffTime = System.currentTimeMillis() - appAttachTime
        Log.d(TAG, "启动时间: $diffTime")
    }

    fun toggleViewVisible(vararg views: View) {
        for (view in views) {
            if (view.visibility == View.VISIBLE) {
                view.visibility = View.INVISIBLE
            } else {
                view.visibility = View.VISIBLE
            }
        }
    }
}