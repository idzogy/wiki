# 이저그 위키
## 문법
기본적으론 마크다운 문법을 따릅니다만, 이저그에서만 사용하는 문법도 
있습니다. 다만, 다른 위키의 문법을 본다면 유사한 부분이 많기 때문에 
완전히 새로운 것은 아닙니다. 이 문서에는 또한 알면 유용할 수 있는 문법도 기재합니다.

### 내부 링크
```
[[문서제목]]
```

### 내부 이미지
```
![[이미지.png]]
```

### 루비 문자
루비 문자란 <ruby><rb>이렇게</rb><rt>こう</rt></ruby> 표시되는 것입니다.  
**b**가 bottom, **t**가 top에 대응한다는 사실을 기억하면 좋습니다.
```
<ruby><rb>아래에 올 문자열</rb><rt>위에 올 문자열</rt></ruby>
```

### 틀
현재 틀 문법이 **지원됩니다.**  
다만 틀 변수 기능은 지원되지 않습니다.
```
{{틀:틀이름}}
```

#### 틀 변수
**틀에서**
변수에 해당하는 부분은 부등호 기호를 연달아 써서 감싼다.
```
이것은 **<<문자열>>**을 출력하는 틀입니다.
```

**틀을 사용하는 문서에서**  
파이프 문자 |와 =을 사용합니다.  
변수의 내용을 채우지 않을 시 그 변수는 삭제됩니다.
```
{{틀:예시|문자열=🫠}}
```

**결과**  
이것은 **문자열**을 출력하는 틀입니다.