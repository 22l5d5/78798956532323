let 標記線計數 = 0
let 總標記線數量 = 14
let 基礎速度 = 200
let kp = 150
let kd = 180
let 紅外線IR1 = 22
let 紅外線IR2 = 0
let 紅外線IR4 = 0
let 紅外線IR3 = 0
let 紅外線IR5 = 0
let Error_P_old = 0
let Error_D = 0
let Error_P = 0
let PID_Val = 0
let 線位置 = 0
let 終點時間 = 0
let 找到終點 = 0
let 中間紅外線狀態 = 0
let 左邊紅外線狀態 = 0
let 右邊紅外線狀態 = 0
let 路口 = ""
let 路口型態 = 0
let 路口判斷結束 = 0
//  設定PID控制器
function 設定PID控制器(基礎速度2: number, kp2: number, kd2: number) {
    
    線位置 = BitRacer.readLine()
    Error_P = 0 - 線位置
    Error_D = Error_P - Error_P_old
    Error_P_old = Error_P
    PID_Val = Error_P * kp2 + Error_D * kd2
    BitRacer.motorRun(BitRacer.Motors.M_R, Math.constrain(基礎速度2 + PID_Val, -1000, 1000))
    BitRacer.motorRun(BitRacer.Motors.M_L, Math.constrain(基礎速度2 - PID_Val, -1000, 1000))
}

//  偵測標記線的函式
function 判斷標記線() {
    
    if (紅外線IR1 > 1000 || 紅外線IR5 > 1000) {
        basic.pause(50)
        標記線計數 += 1
        //  basic.showNumber(標記線計數); // 顯示當前標記線數量
        //  music.play(music.tonePlayable(988, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone);
        //  basic.showIcon(IconNames.No);
        if (標記線計數 >= 總標記線數量) {
            //  到達最後一條標記線，停止動作
            BitRacer.motorRun(BitRacer.Motors.All, 0)
        } else {
            巡白線()
        }
        
    }
    
}

//  讀取紅外線感應器的數值
function 讀取紅外線() {
    
    紅外線IR1 = BitRacer.readIR2(1)
    紅外線IR2 = BitRacer.readIR2(2)
    紅外線IR3 = BitRacer.readIR2(3)
    紅外線IR4 = BitRacer.readIR2(4)
    紅外線IR5 = BitRacer.readIR2(5)
}

//  主程式，用來巡線並偵測終點及標記線
//  主程式，用來巡線並偵測終點及標記線
function 巡白線() {
    while (標記線計數 < 總標記線數量) {
        //  基礎速度和PID控制
        設定PID控制器(基礎速度, kp, kd)
        讀取紅外線()
        //  如果 IR1 < 1000，就執行右轉
        //  持續右轉的時間
        if (紅外線IR1 > 1000) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 基礎速度 - 50)
            //  減速右側馬達
            BitRacer.motorRun(BitRacer.Motors.M_L, 基礎速度 + 50)
            //  加速左側馬達
            basic.pause(200)
        }
        
        判斷標記線()
        //  檢查標記線
        if (標記線計數 >= 總標記線數量) {
            break
        }
        
    }
}

//  按下 A 鍵後開始巡線
//  music.play(music.tonePlayable(988, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone);
//  basic.showIcon(IconNames.Square);
//  basic.clearScreen();
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    basic.pause(1000)
    //  找到終點 = 0;
    標記線計數 = 0
    巡白線()
})
