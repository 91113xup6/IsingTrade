#include <windows.h> 
#include<cstdlib>
#include<ctime>
#include<cstring>


LRESULT CALLBACK WndProc (HWND, UINT, WPARAM, LPARAM) ;  
int WINAPI WinMain (HINSTANCE hInstance, HINSTANCE hPrevInstance,PSTR szCmdLine, int iCmdShow) {
	static char szAppName[] = TEXT ("test") ;  
	HWND hwnd ;  
	MSG msg ;  
	WNDCLASS wndclass ;  
	
	wndclass.style    = CS_HREDRAW | CS_VREDRAW ;
	wndclass.lpfnWndProc  = WndProc ;  
	wndclass.cbClsExtra   = 0 ;  
	wndclass.cbWndExtra   = 0 ;  
	wndclass.hInstance   = hInstance ; 
	wndclass.hIcon    = LoadIcon (NULL, IDI_APPLICATION) ;    
	wndclass.hCursor   = LoadCursor (NULL, IDC_ARROW) ;   
	wndclass.hbrBackground = (HBRUSH) GetStockObject (WHITE_BRUSH) ;    
	wndclass.lpszMenuName = NULL ;  
	wndclass.lpszClassName = szAppName ;  
	
	if (!RegisterClass (&wndclass))return 0 ;      
	
	hwnd = CreateWindow(szAppName, // window class name    
						szAppName, // window caption    
						WS_OVERLAPPEDWINDOW, // window style    
						CW_USEDEFAULT, // initial x position    
						CW_USEDEFAULT, // initial y position    
						CW_USEDEFAULT, // initial x size    
						CW_USEDEFAULT, // initial y size    
						NULL,   // parent window handle       
						NULL,         // window menu handle       
						hInstance,     // program instance handle       
						NULL) ;      // creation parameters        
		
	ShowWindow (hwnd, SW_SHOWMAXIMIZED) ;  
	UpdateWindow (hwnd) ;        
		
	while (GetMessage (&msg, NULL, 0, 0))      {   
		TranslateMessage (&msg) ;     
		DispatchMessage (&msg) ;      
	}  
	
	return msg.wParam ; 
}  

LRESULT CALLBACK WndProc (HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam) {  
	int N = 1300, M = 300;
	bool map[N][M];
	bool IfCon;
	int x, y;
	switch (message)      {  
	case  WM_PAINT: 
		HDC    hdc ;  PAINTSTRUCT  ps ; 
		hdc = BeginPaint (hwnd, &ps) ;   
		                              
		srand(time(NULL));
		memset(map, 0, sizeof(map));
		for(int i = 0;i < N;i++)map[i][0] = 1;
		IfCon = true;
		while(IfCon){
			x = rand() % N;
			y = M - 1;
			while(true){
				if(y >= 2 * M || x < 0 || x >= N)break;
				else if(y >= M);
				else{
					if(	(x != 0 && map[x - 1][y]) || (x != N - 1 && map[x + 1][y]) || \
						(y != M - 1 && map[x][y + 1]) || map[x][y - 1]){
						map[x][y] = 1;
						
						if(y == M - 1)
							IfCon = 0;
						break;
					}
				}
				switch(rand() % 5){
					case 0:
						y++;	break;
					case 1:
					case 4:
						y--;	break;
					case 2:
						x--;	break;
					case 3:
						x++;	break;
					
				}
			}
		}
		for(int i = 0;i < M;i++)
			for(int j = 0;j < N;j++)
				if(map[j][i])
					Ellipse(hdc, j - 1, 2 * (i - 1), j + 1, 2 * (i + 1)); 
		
		EndPaint (hwnd, &ps) ;    
		return 0 ;          
	case WM_DESTROY:   
		PostQuitMessage (0) ;   
		return 0 ;      
	}    
	return DefWindowProc (hwnd, message, wParam, lParam) ; 
} 
