package com.peaker.wanandroid.base

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

/**
 * ac基类
 */
abstract class BaseActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initParmas(intent.extras)
        setContentView(initLayout())
        initView()
        initData()
    }

    abstract fun initParmas(bundle: Bundle?)//getIntent() 传参  这个问号很关键 代表这个参数可以为空
    abstract fun initLayout(): Int //设置布局layout
    abstract fun initView() //初始化view
    abstract fun initData() //数据操作
}