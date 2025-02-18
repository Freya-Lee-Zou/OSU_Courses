import Sentence


main = do
	let s1 = buildS2 Cats Hug Bunnies
	let s2 = buildS1 Cats Cuddle
	let s3 = buildNP Silly Ducks
	let s4 = buildNAnd Dogs Cats
	let s5 = conjunction [s2, s1]
	let s6 = buildS2 s3 Chase s4	
	let s7 = buildS1 Dogs Scare
	let s8 = conjunction [s1, s2, s7]
	let s9 = buildNP Old s3
	let s10 = buildS2 s9 Cuddle Cats

	putStr " s1 = "
	print (s1)
	print (pretty(s1))
	putStr" Is nice s1 = "
	print (isNice s1)
	putStr" Word count s1 = "
	print (wordCount s1)
        putStrLn "*********************"
	putStr " s2 = "
	print (s2)
	print (pretty(s2))
	putStr" Is nice s2 = "
	print (isNice s2)
	putStr" Word count s2 = "
	print (wordCount s2)
	putStrLn "*********************"
	putStr " s5 = "
	print (s5)
	print (pretty(s5))
	putStr" Is nice s5 = "
	print (isNice s5)
	putStr" Word count s5 = "
	print (wordCount s5)  
        putStrLn "*********************"
	putStr " s6 = "
	print (s6)
	print (pretty(s6))
	putStr" Is nice s6 = "
	print (isNice s6)
	putStr" Word count s6 = "
	print (wordCount s6)
        putStrLn "*********************"	
	putStr " s7 = "
	print (s7)
	print (pretty(s7))
	putStr" Is nice s7 =  "
	print (isNice s7)
	putStr" Word count s7 = "
	print (wordCount s7)
        putStrLn "*********************"	
	putStr " s8 = "
	print (s8)
	print (pretty(s8))
	putStr" Is nice s8 = "
	print (isNice s8)
	putStr" Word count s8 = "
	print (wordCount s8)
        putStrLn "*********************"	
	putStr " s10 = "
	print (s10)
	print (pretty(s10))
	putStr" Is nice s10 = "
	print (isNice s10)
	putStr" Word count s10 = "
	print (wordCount s10)
