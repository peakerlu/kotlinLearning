package com.example.kotlindemo;


import java.util.EnumMap;

class Testjava {

    enum Sex {
        MAN(true), WOMAN(false);

        Sex(boolean isMan) {
            this.isMan = isMan;
        }

        private boolean isMan;

        public boolean isMan() {
            return isMan;
        }

        public void setMan(boolean man) {
            isMan = man;
        }
    }

    public enum Color {
        RED, BLUE, GREEN, BLACK
    }

    public static void main(String[] args) {


/*
        System.out.println(Sex.MAN.isMan);

        for(WeekDay day:WeekDay.values())

        {
            System.out.println(day+"====>"+day.getDay());
        }
*/

        System.out.println(new DataBaseInfo().getURL(DataBaseType.DB2));

        TypeTest();
    }

    public static void TypeTest() {
        String typeName = "f5";
        TypeEnum type = TypeEnum.fromTypeName(typeName);
        //type:是TypeEnum类实例化对象     typeName：实例化对象type的值
        // ordinal：实例化对象type的序号（int）          排序值(默认自带的属性 ordinal 的值)
        //name：实化对象的名字（String）                            枚举名称(即默认自带的属性 name 的值)
        System.out.println(type+",typeName:"+type.getTypeName()+",ordinal:"+type.ordinal()+",name:"+type.name());
    }
}

enum WeekDay {
    Mon("Monday"), Tue("Tuesday"), Wed("Wednesday"), Thu("Thursday"), Fri("Friday"), Sat("Saturday"), Sun("Sunday");
    //以上是枚举的成员，必须先定义，而且使用分号结束
    private final String day;

    private WeekDay(String day) {
        this.day = day;
    }

    public String getDay() {
        return day;
    }

}

//定义数据库类型枚举
enum DataBaseType {
    MYSQUORACLE, DB2, MYSQL, ORACLE, SQLSERVER
}

//某类中定义的获取数据库URL的方法以及EnumMap的声明
class DataBaseInfo {
    private EnumMap<DataBaseType, String> urls = new EnumMap<DataBaseType, String>(DataBaseType.class);

    public DataBaseInfo() {
        urls.put(DataBaseType.DB2, "jdbc:db2://localhost:5000/sample");
        urls.put(DataBaseType.MYSQL, "jdbc:mysql://localhost/mydb");
        urls.put(DataBaseType.ORACLE, "jdbc:oracle:thin:@localhost:1521:sample");
        urls.put(DataBaseType.SQLSERVER, "jdbc:microsoft:sqlserver://sql:1433;Database=mydb");
    }

    public String getURL(DataBaseType type) {
        return this.urls.get(type);
    }
}



 enum TypeEnum {

    FIREWALL("firewall"),
    SECRET("secretMac"),
    BALANCE("f5");

    private String typeName;

    TypeEnum(String typeName) {
        this.typeName = typeName;
    }

    /**
     * 根据类型的名称，返回类型的枚举实例。
     *
     * @param typeName 类型名称
     */
    public static TypeEnum fromTypeName(String typeName) {
        for (TypeEnum type : TypeEnum.values()) {
            if (type.getTypeName().equals(typeName)) {
                return type;
            }
        }
        return null;
    }

    public String getTypeName() {
        return this.typeName;
    }
}

