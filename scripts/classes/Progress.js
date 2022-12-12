// ==================================================
// PROGRESS COLLECTION
// ==================================================

class ProgressBar extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, args={}) 
    {
        super(scene, x, y).setDataEnabled();
        scene.add.existing(this);

        this.args = args || {};
        this.args.fontSize = args.fontSize || '5em';
        this.data.set('data', {w:args.w || 550, h:args.h || 80, offset:args.offset || 20});
        this.data.set('base', {fillc:0x222222, filla:0.8, linew:1, linec:0x6ab04c, linea:0,
            f:true, l:false});
        this.data.set('bar', {fillc:0xA3CB38, filla:1.0, linew:1, linec:0x000000, linea:0,
            f:true, l:false});

        this.base = this.scene.add.graphics();
        this.bar = this.scene.add.graphics();
        this.text = scene.add.text(0, 0, '0%', { align:'left', color:'#ffffff',
            fontSize:'5em', fontFamily:'Font_Main', wordWrap:{width:1100},
            stroke:'#000000', strokeThickness:5 }).setOrigin(0.5, 0.5).setName('text');
        this.add([this.base, this.bar, this.text]);
        this.setGraphics({type:'base'});
        this.setGraphics({type:'bar'});
    }

    setArgs (args={}) 
    {
        this.args = args || {};
        this.args.fontSize = args.fontSize || this.args.fontSize;
        this.data.set('data', {w:args.w || 550, h:args.h || 80, offset:args.offset || 20});
        this.text.setFont({fontSize:this.args.fontSize, fontFamily:'Font_Main'});
        this.setGraphics({type:'base'});
        this.setGraphics({type:'bar'});
        return this;
    }

    setGraphics (args={}) 
    {
        let data = this.data.get(args.type);
        data.f = args.f || data.f; data.l = args.l || data.l;
        data.fillc = args.fillc || data.fillc; data.filla = args.filla || data.filla;
        data.linew = args.linew || data.linew; data.linec = args.linec || data.linec;
        data.linea = args.linea || data.linea;
        this.data.set(args.type, data);
        
        this[args.type].setDefaultStyles({
            lineStyle: {width:data.linew, color:data.linec, alpha:data.linea},
            fillStyle: {color:data.fillc, alpha:data.filla}
        });
        this.drawBase();
        this.drawProgress();
    }

    drawBase (base=this.data.get('base'), data=this.data.get('data')) 
    {
        this.base.clear();
        if (base.f) this.base.fillRect(0-(data.w/2), 0-(data.h/2), data.w, data.h);
        if (base.l) this.base.strokeRect(0-(data.w/2), 0-(data.h/2), data.w, data.h);
    }

    drawProgress (max=2, progress=1, bar=this.data.get('bar'), data=this.data.get('data')) 
    {
        let x = 0-(data.w/2)+(data.offset/2), y = 0-(data.h/2)+(data.offset/2);
        let w = (data.w-data.offset)*(progress/max), h = data.h-data.offset;
        this.bar.clear();
        if (bar.f) this.bar.fillRect(x, y, w, h);
        if (bar.l) this.bar.strokeRect(x, y, w, h);
        this.updateText(max, progress);
        return this;
    }

    updateText (max=2, progress=1, args=this.args) 
    {
        // OVERRIDABLE
        this.text.setText(progress+'/'+max);
    }
}



class ProgressCircle extends Phaser.GameObjects.Container 
{
    constructor (scene, x=scene.scale.width/2, y=scene.scale.height/2, args={}) 
    {
        super(scene, x, y);
        scene.add.existing(this);

        this.base_graphics = this.scene.add.graphics();
        this.progress_graphics = this.scene.add.graphics();
        this.text = scene.add.text(0, 0, '0%', { align:'left', color:'#000000',
            wordWrap:{width:1100}, stroke:'#ffffff', strokeThickness:5 })
            .setOrigin(0.5, 0.5).setName('text');

        this.add([this.base_graphics, this.progress_graphics, this.text]);
        this.setArgs();
    }

    setArgs (args={}) 
    {
        this.args = args || {};
        this.args.fontSize = args.fontSize || '5em';

        this.args.radius = args.radius || 100;
        this.args.base_w = args.base_w || 50;
        this.args.base_c = args.base_c || 0x000000;
        this.args.base_a = args.base_a || 0.5;
        this.args.progress_w = args.progress_w || 40;
        this.args.progress_c = args.progress_c || 0x308880;
        this.args.progress_a = args.progress_a || 1;

        this.text.setFont({fontSize:this.args.fontSize, fontFamily:'Font_Main'});
        this.drawBase();
        this.drawProgress();
        return this;
    }

    drawBase (args=this.args) 
    {
        this.base_graphics.clear().beginPath().closePath();
        this.base_graphics.lineStyle(args.base_w, args.base_c, args.base_a)
            .arc(0, 0, args.radius, Phaser.Math.DegToRad(91), Phaser.Math.DegToRad(90), false);
        this.base_graphics.strokePath();
        return this;
    }

    drawProgress (max=2, progress=1, args=this.args) 
    {
        this.progress_graphics.clear().beginPath();
        this.progress_graphics.lineStyle(args.progress_w, args.progress_c, args.progress_a)
            .arc(0, 0, args.radius, Phaser.Math.DegToRad(91), 
                Phaser.Math.DegToRad((360*(progress/max)+91)), false);
        this.progress_graphics.strokePath();
        this.text.setText(parseInt((progress/max)*100)+'%');
        return this;
    }
}



export {
    ProgressBar, ProgressCircle
};
