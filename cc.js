freq=400
freq_old=400
duty=50
duty_old=50
waschanged =0
usart_ptr=0
toggle =0
//waiting = 0
//t_cnt=0
//in_buf=""

function OnStart() {
    cfg.No_Dom , cfg.Landscape;
	BuildUI()
	uart_init()
UDP_init() 
setInterval(  update, 500 )
 }

function update() {
if (toggle) {
    freq =  parseInt(freq_seek.GetValue()*10000,10)
    duty =  parseInt(duty_seek.GetValue()*255,10)
    if (duty>255) { duty=255 }
  //  console.log("|" + freq_old + "|" + freq + "|")
 //   console.log("|" + duty_old + "|" + duty + "|")
    if (!(freq_old == freq && duty_old == duty)) {
        packet = duty + "|" + freq
        freq_old == freq
        duty_old == duty
        freq_scr_text.SetText("Freq:" + freq)
        duty_scr_text.SetText("DC:" + duty)
        net.SendDatagram( packet, "UTF-8", address, port ); }
        toggle=0;
    }
}

// UDP_init
function UDP_init() {
    net = app.CreateNetClient( "UDP" );
	address = net.GetBroadcastAddress();
    id = app.GetDeviceId();
    port = 4210;
    //setInterval( CheckForMsg, 500 ); 
    }
function CheckForMsg() {
    var packet = net.ReceiveDatagram( "UTF-8", port, 10 );
    if( packet ) {
        var parts = packet.split( "|" );
        if( parts[0] != id )
            app.ShowPopup( parts[1] ); 
        freq_in_text.SetValue(parts[1]);
        duty_in_text.SetValue(parts[2]); } }

// uart init 
function uart_init() {
    usb = app.CreateUSBSerial(14400 ,8,1,0);
	if (!usb) { app.ShowPopup( "Please connect your USBSerial Bridge" ) }
    else { usb.SetSplitMode( "End", "\n" ); 
        //send_status()
       usb.SetOnReceive( usart_Rx ) 
         } }


// UI build 
function BuildUI() {
    
    layMain = app.CreateLayout( "linear", "VCenter,FillXY" )

// Buttons
    btnUDP = app.CreateButton( "udp", .2,.1 )
    //btnUDP.SetOnTouch(CheckForMsg)
 //   layMain.AddChild( btnUDP )
// graphic
    layGrph = app.CreateLayout("Linear", "Horizontal", 0.9, 0.3)
    layMain.AddChild(layGrph)
// data from obj
    layTxt = app.CreateLayout( "linear", "VCenter,FillXY" )
    freq_in_text = app.CreateText("Freq_in",0.1,0.1)
    freq_in_text.SetTextSize(12)
    layTxt.AddChild(freq_in_text)
    duty_in_text = app.CreateText("Duty_in",0.1,0.1)
    duty_in_text.SetTextSize(12)
    layTxt.AddChild(duty_in_text)
	layGrph.AddChild(layTxt)

    freq_grph = app.CreateImage(null, 0.35, 0.2)
    //freq_grph.DrawCircle( 0.5, 0.5, 0.1 )
    freq_grph.SetColor( "#a0a0a0" )
    freq_grph.SetPaintColor( "#000000" )
    freq_grph.DrawRectangle( 0.01, 0.01, .99, 0.99 )
    layGrph.AddChild(freq_grph)

    duty_grph = app.CreateImage(null, 0.35,0.2)
    duty_grph.SetColor( "#a0a0a0" )
    duty_grph.SetPaintColor( "#000000" )
    duty_grph.DrawRectangle( 0.01, 0.01, .99, 0.99 )
    layGrph.AddChild(duty_grph)
    layMain.AddChild(layGrph)


//  seek bars
    laySeek = app.CreateLayout("Linear", "HCenter", 0.9, 0.4)
    laySeekFreq = app.CreateLayout("Linear", "Horizontal", 0.9, 0.1)
    freq_scr_text = app.CreateText("Freq",0.1,0.1)
	laySeekFreq.AddChild( freq_scr_text )
	freq_m_10 = app.CreateButton( "-10",0.1,0.17)
    freq_m_10.SetOnTouch( freq_m10 )
    laySeekFreq.AddChild( freq_m_10 )
    freq_m_1 = app.CreateButton( "-1",0.1,0.17)
    freq_m_1.SetOnTouch( freq_m1 )
    laySeekFreq.AddChild( freq_m_1 )
    freq_seek = app.CreateSeekBar( 0.4,0.1 )
    freq_seek.SetRange( 1.0 )
    freq_seek.SetValue( 0.5 )
    freq_seek.SetOnTouch(freq_seek_OnTouch )
    laySeekFreq.AddChild( freq_seek )
	freq_p_1 = app.CreateButton( "+1",0.1,0.17)
    freq_p_1.SetOnTouch( freq_p1 )
    laySeekFreq.AddChild( freq_p_1 )
    freq_p_10 = app.CreateButton( "+10",0.1,0.17)
    freq_p_10.SetOnTouch( freq_p10 )
    laySeekFreq.AddChild( freq_p_10 )

    
    laySeekDuty = app.CreateLayout("Linear", "Horizontal", 0.9, 0.1)
    duty_scr_text = app.CreateText("DC",0.1,0.1)
	laySeekDuty.AddChild( duty_scr_text )
    duty_m_10 = app.CreateButton( "-10",0.1,0.17)
    duty_m_10.SetOnTouch( duty_m10 )
    laySeekDuty.AddChild( duty_m_10 )
    duty_m_1 = app.CreateButton( "-1",0.1,0.17)
    duty_m_1.SetOnTouch( duty_m1 )
    laySeekDuty.AddChild( duty_m_1 )
    duty_seek = app.CreateSeekBar( 0.4, 0.1 )
    duty_seek.SetRange( 1.0 )
    duty_seek.SetValue( 0.5 )
    duty_seek.SetOnTouch( freq_seek_OnTouch )
    laySeekDuty.AddChild( duty_seek )
    duty_p_1 = app.CreateButton( "+1",0.1,0.17)
    duty_p_1.SetOnTouch( duty_p1 )
    laySeekDuty.AddChild( duty_p_1 )
    duty_p_10 = app.CreateButton( "+10",0.1,0.17)
    duty_p_10.SetOnTouch( duty_p10 )

    laySeekDuty.AddChild( duty_p_10 )
    
    laySeek.AddChild(laySeekFreq)
    laySeek.AddChild(laySeekDuty)
    layMain.AddChild(laySeek)
	app.AddLayout( layMain ) 
//	setInterval(update_graph,50)
}
function duty_m1() { duty_seek.SetValue(duty_seek.GetValue()-0.01); toggle=1 }
function duty_m10() { duty_seek.SetValue(duty_seek.GetValue()-0.1); toggle=1 }
function duty_p1() { duty_seek.SetValue(duty_seek.GetValue()+0.01); toggle=1 }
function duty_p10() { duty_seek.SetValue(duty_seek.GetValue()+0.1); toggle=1 }
function freq_m1() { freq_seek.SetValue(freq_seek.GetValue()-0.01); toggle=1 }
function freq_m10() { freq_seek.SetValue(freq_seek.GetValue()-0.1); toggle=1 }
function freq_p1() { freq_seek.SetValue(freq_seek.GetValue()+0.01); toggle=1 }
function freq_p10() { freq_seek.SetValue(freq_seek.GetValue()+0.1); toggle=1 }
/*
	grp_pnts=[]
	grp_ptr=0
	changed=0
function update_graph(){
//duty_grph.SetPaintColor( "#000000" )
 //   duty_grph.DrawRectangle( 0.01, 0.01, .99, 0.99 )
 if(changed){
changed=0
for(var d=0;d<9;d++){

grp_pnts[d]=grp_pnts[d+1]
duty_grph.SetPaintColor( "#000000" )
duty_grph.DrawLine(  .8*d/10,0,.8*d/10,1)
duty_grph.SetPaintColor( "#00f000" )
duty_grph.DrawLine(  .8*d/10,grp_pnts[d],.8*(d+1)/10,grp_pnts[d+1])}
grp_pnts[9]= freq_seek.GetValue()}} */
function freq_seek_OnTouch () {
    toggle=1 
    changed=1 } 
function duty_seek_OnTouch (){ toggle=1 }
// usbreceive / usart_ptr manipulation
function usart_Rx(data) { console.log("data: [" + data + "]")   }
function send_status() { }

// Utils                    
function strlen(string) { len=0
    for (var i=0; string[i] != null; i++) len++
    return len }
