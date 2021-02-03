package com.example.kotlindemo

import org.junit.Test

class heightOrderFunTest {

    fun a(ff: (Int) -> String): String {
        return ff(100)
    }

    fun b(a: Int): String {
        return "方法b返回的值$a"
    }

    @Test
    fun text() {
        var a = a(::b)
        println(a)
        ::b.invoke(101)

        a(fun(a: Int): String {
            return "方法b返回的值$a"
        })

        val d=fun(i:Int):String{
            return i.toString()
        }

    }

}