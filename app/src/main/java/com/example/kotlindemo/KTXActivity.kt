package com.example.kotlindemo

import android.content.Context
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.core.content.edit
import androidx.core.net.toUri
import kto.Utils
import org.jetbrains.annotations.TestOnly

const val tst = "静态常量"

class KTXActivity : AppCompatActivity() {
        companion object{
            const val TTTTTT="静态常量2222"
        }
    var count: Int = 9
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ktx)
//        SharedPreferences

        textShare()
    }

    private fun textShare() {

        val sharedPreferences: SharedPreferences = getSharedPreferences("sss", Context.MODE_PRIVATE)

        sharedPreferences.edit()
            .putInt("num", 1)
            .apply()

//        sharedPreferences.edit { putBoolean("b", false) }

        var string = "777"
        var toInt = string.toInt()


        val name: String = "kotlin" //不可变的参数
        var nameto: String = "kotln"//可变的

        val type = "类型推断"
        val i = 32
        var nam = "fsfdsfs"
        var toUpperCase = nam.toUpperCase()
        var inc = i.inc()  //加一
        var inv = i.inv()//加一 加符号
        var unaryPlus = i.unaryPlus() //本数
        var unaryMinus = i.unaryMinus()//负数
//        Utils.
    }

    fun kotlinText() {
        val type = "类型推断"
        val i = 32
        var nam = "fsfdsfs"
        var toUpperCase = nam.toUpperCase()
        var inc = i.inc()
        var inv = i.inv()
        var unaryPlus = i.unaryPlus()
        var unaryMinus = i.unaryMinus()
        println("输出:$type inc $inc inv $inv unaryplus $unaryPlus unaryMins $unaryMinus")
        println("if 表达式------------------------------------\n")
        var s = if (i > 33) {
            "大于33"
        } else {
            "小于等于33"
            "返回最后一行结果"
        }

        println("s $s")
        println("when表达式----------------------------------------------\n")

        var string: String = when {
            i == 33 -> "等于33"
            inc > 32 -> "inc大于32"
            inc == 33 -> "inc等于33"
            else -> "其他情况"
        }

        println("when表达式 返回的结果 $string")

        /*   var n: String? = null
           var toUpperCase1 = n!!.toUpperCase()

           if (n != null) {
               var toUpperCase1 = n.toUpperCase()
           }*/

        println("${funText2()}")

        println("匿名函数 --------------------------\n")


        val stringLengthFunc: (String) -> Int = {
            it.length
        }
//        var stringLengthFunc1 = stringLengthFunc("android kotlin")
        var stringLengthFunc1 = stringLengthFunc("123456789")
        println(stringLengthFunc1)

        println("高阶函数 --------将函数用作一个函数的参数------------------\r\n")

        var heightFun = heightFun("1234567890") {
            it.length
        }
        println(heightFun)
        hfun("android")
        println("高阶函数 --------将函数用作一个函数的返回值------------------\r\n")

        addInt(8, 8)


    }


    fun funText2(): String = if (count > 8) {
        ">8"
    } else {
        "<=8"
    }

    fun heightFun(string: String, add: (String) -> Int): Int {


        return add(string)
    }

    fun hfun(string: String, add: (String) -> Int = { it.length }) {

        println("----" + add(string))
    }

    fun addInt(a: Int, b: Int): Int {

        println("addint方法被调用...")
        // TODO("发生错误 ")

        return a + b
    }
    /*  fun af(a: Int, ::): Int {


      }
  */

}
