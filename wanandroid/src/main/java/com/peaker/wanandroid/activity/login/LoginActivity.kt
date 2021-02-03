package com.peaker.wanandroid.activity.login

import android.os.Bundle
import android.widget.Toast
import com.peaker.wanandroid.R
import com.peaker.wanandroid.base.BaseActivity
import kotlinx.android.synthetic.main.activity_login.*

class LoginActivity : BaseActivity() {
    override fun initParmas(bundle: Bundle?) {

    }

    override fun initLayout(): Int = R.layout.activity_login

    override fun initView() {
        login_btn_login.setOnClickListener {
            Toast.makeText(this, "登录成功", Toast.LENGTH_LONG)
        }

    }

    override fun initData() {

    }


}
