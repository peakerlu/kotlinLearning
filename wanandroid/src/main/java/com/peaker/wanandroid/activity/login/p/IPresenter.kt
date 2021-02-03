package com.peaker.wanandroid.activity.login.p

import com.peaker.wanandroid.activity.login.v.IView


interface IPresenter {
    fun register(view: IView?)

    fun unRegister()
}