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


