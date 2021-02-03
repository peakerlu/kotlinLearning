package com.example.kotlindemo

import android.os.Bundle
import android.transition.AutoTransition
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.kotlindemo.dao.*
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    var str: StringBuffer? = StringBuffer()
    lateinit var studentDao: StudentDao


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        studentDao = AppDataBase.getDBInstace().getStudentDao()
        btn.text = "按钮"
        //添加数据
        text()
        btn.setOnClickListener {


        }
        btn2.setOnClickListener {
            var allByDateDesc = AppDataBase.getDBInstace().getStudentDao().getAllByDateDesc()
            str?.delete(0, str!!.length)
            for (student in allByDateDesc) {

                str?.append(student.toString())
            }

            tv.setText(str)

        }
        
    }

    fun text() {
        var strs: MutableList<Book> = mutableListOf()
        var strs2: MutableList<Pen> = mutableListOf()
//        var strs: List<Book> = mutableListOf()
//        strs.add(Book("三生三世"))
//        strs.get(0).BookName="三生三世"
//        strs.get(0) = Book("三生三世")
        strs2.add(Pen("fdsfds"))
        strs.add(Book("三生三世", "1200", strs2))
        strs.add(Book("简爱", "1200", strs2))
        strs.add(Book("肖生克的救赎", "1200", strs2))
        strs.add(Book("雪中悍刀行", "1200", strs2))
        strs.add(Book("局中人", "1200", strs2))
        var teacher1 = Teacher(0, "张雪峰", "12", "考研", strs)
        var teacher2 = Teacher(1, "胡一闪", "4", "数学", strs)
        var teacher3 = Teacher(2, "陈数", "6", "编程", strs)
        var teacherDao = AppDataBase.getDBInstace().getTeacherDao()
        var tList: MutableList<Teacher> = mutableListOf()
        tList.add(teacher1)
        tList.add(teacher2)
        tList.add(teacher3)
        teacherDao.insertAll(tList)
        var teacher = teacherDao.getTeacher(0)
        var sList11 = teacher.sList1

        var get = sList11?.get(0)?.sList2?.get(0)

        var studentDao = AppDataBase.getDBInstace().getStudentDao()
        var address = Address("杭州", 1)
        var address1 = Address("杭州", 1)
        var s_1 = Student(1, 2, "s1", "小学", address)
        var s_2 = Student(2, 1, "s2", "小学", address)
        var s_3 = Student(3, 0, "s3", "小学", address)
        var s_4 = Student(4, 1, "s4", "大学", address1)
        var s_6 = Student(6, 2, "s6", "大学", address)
        var s_5 = Student(5, 1, "s5", "大学", address1)
        var s_59 = Student(9, 0, "87979", "大学", address1)
        var sList: MutableList<Student> = mutableListOf()
        s_1.studentName = "lll"

        sList.add(s_1)
        sList.add(s_2)
        sList.add(s_3)
        sList.add(s_4)
        sList.add(s_5)
        sList.add(s_6)
        sList.add(s_59)
        studentDao.insertAll(sList)
        var sList1: MutableList<InBean> = mutableListOf()
        sList1 = studentDao.getStudnetByid()
        var toJson = Gson().toJson(sList1)
        LogUtil.d("$toJson")

        Log.d("lyf", toJson)


    }

}
