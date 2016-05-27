    ldc 1
    st 4
    ldc 1
    ldc 1
    st 3
    ldc 1
loop:
    add
    st 2
    ld 2
    ld 3
    add
    st 3
    ldc 1
    ld 3
    ldc 2000000
    cmp
    sub
    br break
    st 1
    ld 3
    ld 4
    add
    st 4
    ld 3
    ld 2
    jmp loop
break:
    st 1
    ld 4
    ret
