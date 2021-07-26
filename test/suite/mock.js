exports.javascript = `




    public a = {
        aname: { local: "John" } // John's name
    }

    public d: boolean; /** Comment with d */

    //Comment for c
    public c: boolean;

    /** Comment for b */
    public b = "b"



    private jsonGo(): any {
        return ({
            a: {
                ai: { /** Comments for ai */ }
            },
            c: {}
        d: {}
        })
    }

    /**
    * @description dMethod
    * @param N/A
    * @see ["", [[[], [{}]]], { e: { ie: '' } }]
    */

    private dMethod(): void {
        // Inner Comment
        this.c = true // {} ${1 + 2} "" '' \`\` \${}
    }

    private aMethod = (): void => { } // Commnet for aMehod


`



exports.javascript2 = {
    methods: ` public a():void {} /** method a inline comments */

/**
 * outer commnets for c
 **/
   public c(args: string[]): string {
    /**
     * inner commnets
     **/
}

// outer commnets for b
  public b(args: int[]): /** inner commnets**/ int {
    /** inner commnets**/
}

A = (args: int[])=> {
    return {Av:{}}
}

`
    ,
    properties: `public d= ()=> void {} /** method d inline comments */
public a =[
    {},
    [], /** [] */
    {} // inner {}
]

/** outer commnets for b */
public b =
" \
1\
2\
3\
"
public c=
{
    t: /** t */
    {},

}

public a1 =[
{
   r: {}
}]
`}