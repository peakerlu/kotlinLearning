package com.peaker.wanandroid.activity.login

import com.peaker.wanandroid.activity.login.p.IPresenter
import com.peaker.wanandroid.activity.login.v.IView

class BasePresenter : IPresenter {

    var iview by Weak<IView> {
        null
    }

    override fun register(view: IView?) {
       
    }

    override fun unRegister() {
        TODO("Not yet implemented")

    }


}